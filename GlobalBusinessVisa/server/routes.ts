import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { WebSocketServer, WebSocket } from "ws";
import { z } from "zod";
import axios from "axios";
import { insertOrderSchema, insertMessageSchema } from "@shared/schema";
import { randomBytes } from "crypto";
import session from "express-session";
import cookieParser from "cookie-parser";
import { createHash } from "crypto";
import { generateChatResponse, generateCardRecommendation } from './services/openai';
import { getStaticResponse } from './services/staticResponses';
import MemoryStore from "memorystore";

// Set up in-memory store for sessions
const SessionStore = MemoryStore(session);

// Set up file upload configuration
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniquePrefix + "-" + file.originalname);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG, PNG, and PDF files are allowed"));
    }
    cb(null, true);
  },
});

// Generate browser ID for chat
const generateBrowserId = () => {
  return createHash("sha256").update(randomBytes(16)).digest("hex");
};

// Update cryptocurrency prices using CoinGecko API (no API key required)
async function updateCryptoPrices() {
  try {
    console.log("Updating cryptocurrency prices using CoinGecko API...");
    
    // Mapping of cryptocurrency symbols to their CoinGecko IDs
    const cryptoMap = {
      "BTC": "bitcoin",
      "ETH": "ethereum",
      "BNB": "binancecoin",
      "TRX": "tron"
    };
    
    // Add delay between requests to avoid rate limiting
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    // Default prices in case of API failure (used only if the API fails)
    // These values should match current market prices as closely as possible
    const defaultPrices = {
      "BTC": 66000,
      "ETH": 3000,
      "BNB": 550,
      "TRX": 0.12
    };
    
    try {
      // CoinGecko free API allows fetching multiple coins in a single request
      const coinIds = Object.values(cryptoMap).join(',');
      console.log(`Fetching prices for: ${coinIds}`);
      
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`;
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'GlobalBusinessPay/1.0',
          'Accept': 'application/json'
        }
      });
      
      if (response.data) {
        // Process each cryptocurrency
        for (const [symbol, geckoId] of Object.entries(cryptoMap)) {
          try {
            if (response.data[geckoId] && response.data[geckoId].usd) {
              const price = parseFloat(response.data[geckoId].usd);
              
              if (!isNaN(price)) {
                await storage.updateCryptocurrencyPrice(symbol, price);
                console.log(`Updated ${symbol} price: $${price}`);
                
                // For BNB, also update the settings for backward compatibility
                if (symbol === "BNB") {
                  await storage.updateBNBPrice(price);
                }
              } else {
                throw new Error(`Invalid price format for ${symbol}: ${response.data[geckoId].usd}`);
              }
            } else {
              throw new Error(`Missing price data for ${symbol}`);
            }
          } catch (coinError) {
            console.error(`Error processing ${symbol} price:`, coinError.message);
            
            // Use backup price if needed
            console.log(`Using default price for ${symbol}: $${defaultPrices[symbol]}`);
            await storage.updateCryptocurrencyPrice(symbol, defaultPrices[symbol]);
            
            if (symbol === "BNB") {
              await storage.updateBNBPrice(defaultPrices[symbol]);
            }
          }
        }
      } else {
        throw new Error("Invalid response format from CoinGecko API");
      }
      
      console.log("Cryptocurrency price update completed successfully");
    } catch (apiError) {
      console.error("Error with CoinGecko API:", apiError.message);
      
      // If the batch request fails, use default prices for all cryptocurrencies
      for (const symbol of Object.keys(cryptoMap)) {
        console.log(`Using default price for ${symbol}: $${defaultPrices[symbol]}`);
        await storage.updateCryptocurrencyPrice(symbol, defaultPrices[symbol]);
        
        if (symbol === "BNB") {
          await storage.updateBNBPrice(defaultPrices[symbol]);
        }
      }
    }
  } catch (error) {
    console.error("Failed to update cryptocurrency prices:", error.message);
    console.error("Stack trace:", error.stack);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up middlewares
  app.use(cookieParser());
  app.use(session({
    cookie: { maxAge: 86400000 }, // 24 hours
    store: new SessionStore({}),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || 'globalbusinesspay-secret',
  }));
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  // Serve uploaded files
  app.use("/uploads", express.static(uploadsDir));
  
  // Initialize the HTTP server
  const httpServer = createServer(app);
  
  // Set up WebSocket server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        // Handle chat messages
        if (message.type === 'chat') {
          // Store the message
          const newMessage = await storage.createMessage({
            browserId: message.browserId,
            content: message.content,
            sender: message.sender
          });
          
          // Broadcast to all connected clients with the same browserId
          wss.clients.forEach((client) => {
            if (client.readyState === 1) { // WebSocket.OPEN
              client.send(JSON.stringify({
                type: 'chat',
                message: newMessage
              }));
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });
  
  // Ensure browser ID cookie for chat
  app.use((req, res, next) => {
    if (!req.cookies.browserId) {
      const browserId = generateBrowserId();
      res.cookie('browserId', browserId, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true });
    }
    next();
  });
  
  // Update cryptocurrency prices on startup and every 5 minutes
  updateCryptoPrices();
  setInterval(updateCryptoPrices, 5 * 60 * 1000); // 5 minutes in milliseconds
  
  // API Routes
  
  // Get all cards
  app.get("/api/cards", async (req, res) => {
    try {
      const cards = await storage.getAllCards();
      
      // Get all cryptocurrency prices
      const cryptocurrencies = await storage.getAllCryptocurrencies();
      
      // Get BNB price for backward compatibility
      const bnbCrypto = cryptocurrencies.find(c => c.symbol === 'BNB');
      const bnbPriceUSD = bnbCrypto?.usdPrice || 550; // Default fallback (should match default price above)
      
      // Add USD and cryptocurrency prices to each card
      const cardsWithPrices = cards.map(card => {
        const basePrice = card.basePrice || 599; // Default value if basePrice is null
        const cryptoPrices: Record<string, number> = {};
        
        // Calculate price in each available cryptocurrency
        cryptocurrencies.forEach(crypto => {
          if (crypto.usdPrice > 0) {
            // Calculate how much crypto is needed to purchase this card
            const cryptoAmount = basePrice / crypto.usdPrice;
            // Format to 8 decimal places maximum (standard for crypto)
            cryptoPrices[crypto.symbol] = parseFloat(cryptoAmount.toFixed(8));
          }
        });
        
        return {
          ...card,
          priceUSD: basePrice,
          priceBNB: parseFloat((basePrice / bnbPriceUSD).toFixed(8)),
          cryptoPrices
        };
      });
      
      res.json(cardsWithPrices);
    } catch (error) {
      console.error("Error fetching cards:", error);
      res.status(500).json({ message: "Failed to retrieve cards" });
    }
  });
  
  // Get card by ID
  app.get("/api/cards/:id", async (req, res) => {
    try {
      const cardId = parseInt(req.params.id);
      const card = await storage.getCardById(cardId);
      
      if (!card) {
        return res.status(404).json({ message: "Card not found" });
      }
      
      // Get all cryptocurrency prices
      const cryptocurrencies = await storage.getAllCryptocurrencies();
      const cryptoPrices: Record<string, number> = {};
      
      // Get the base price in USD
      const basePrice = card.basePrice || 599; // Default value if basePrice is null
      
      // Calculate price in each available cryptocurrency
      cryptocurrencies.forEach(crypto => {
        if (crypto.usdPrice > 0) {
          // Calculate how much crypto is needed to purchase this card
          const cryptoAmount = basePrice / crypto.usdPrice;
          // Format to 8 decimal places maximum (standard for crypto)
          cryptoPrices[crypto.symbol] = parseFloat(cryptoAmount.toFixed(8));
        }
      });
      
      // Add BNB price for backward compatibility
      const bnbCrypto = cryptocurrencies.find(c => c.symbol === 'BNB');
      const bnbPriceUSD = bnbCrypto?.usdPrice || 550; // Default fallback (should match default price above)
      
      const cardWithPrices = {
        ...card,
        priceUSD: basePrice,
        priceBNB: parseFloat((basePrice / bnbPriceUSD).toFixed(8)),
        cryptoPrices // Add all cryptocurrency prices
      };
      
      res.json(cardWithPrices);
    } catch (error) {
      console.error("Error fetching card:", error);
      res.status(500).json({ message: "Failed to retrieve card" });
    }
  });
  
  // Get BNB price
  app.get("/api/bnb-price", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      if (!settings) {
        return res.status(404).json({ message: "BNB price not found" });
      }
      
      res.json({
        price: settings.bnbUsdPrice,
        lastUpdated: settings.lastUpdated
      });
    } catch (error) {
      console.error("Error fetching BNB price:", error);
      res.status(500).json({ message: "Failed to retrieve BNB price" });
    }
  });
  
  // Submit order
  app.post("/api/orders", upload.single("receipt"), async (req, res) => {
    try {
      console.log("Order submission received:", req.body);
      console.log("File upload received:", req.file);
      
      // Check for required receipt
      if (!req.file) {
        return res.status(400).json({ message: "Payment receipt is required" });
      }
      
      // Log all data for debugging
      console.log("CardId:", req.body.cardId);
      console.log("FullName:", req.body.fullName);
      console.log("Email:", req.body.email);
      console.log("AccountNumber:", req.body.accountNumber);
      
      if (req.body.gbpId) {
        console.log("GbpId:", req.body.gbpId);
      }
      
      if (req.body.cryptoSymbol) {
        console.log("CryptoSymbol:", req.body.cryptoSymbol);
      }
      
      if (req.body.cryptoAmount) {
        console.log("CryptoAmount:", req.body.cryptoAmount);
      }
      
      if (req.body.cryptoAddress) {
        console.log("CryptoAddress:", req.body.cryptoAddress);
      }
      
      console.log("Receipt:", req.file.filename);
      
      // Build the receipt URL
      const receiptUrl = `/uploads/${req.file.filename}`;
      
      try {
        // Create and validate order data - include only fields that are present
        const orderData: any = {
          cardId: parseInt(req.body.cardId),
          fullName: req.body.fullName,
          email: req.body.email,
          accountNumber: req.body.accountNumber,
          receiptUrl: receiptUrl,
          status: "pending"
        };
        
        // Add optional fields if present
        if (req.body.gbpId) {
          orderData.gbpId = req.body.gbpId;
        }
        
        if (req.body.cryptoSymbol) {
          orderData.cryptoSymbol = req.body.cryptoSymbol;
        }
        
        if (req.body.cryptoAmount) {
          orderData.cryptoAmount = parseFloat(req.body.cryptoAmount);
        }
        
        if (req.body.cryptoAddress) {
          orderData.cryptoAddress = req.body.cryptoAddress;
        }
        
        console.log("Prepared order data:", orderData);
        
        // Parse through Zod schema to validate
        const validatedOrderData = insertOrderSchema.parse(orderData);
        
        // Create order
        const order = await storage.createOrder(validatedOrderData);
        console.log("Order created successfully:", order);
        
        res.status(201).json(order);
      } catch (validationError) {
        console.error("Validation error:", validationError);
        if (validationError instanceof z.ZodError) {
          return res.status(400).json({ 
            message: "Invalid order data", 
            errors: validationError.errors 
          });
        }
        throw validationError; // re-throw if it's not a zod error
      }
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order. Please try again." });
    }
  });
  
  // Use the OpenAI service imported at the top of the file
  
  // Get chat messages for browser ID
  app.get("/api/messages", async (req, res) => {
    try {
      const browserId = req.cookies.browserId;
      if (!browserId) {
        return res.status(400).json({ message: "Browser ID not found" });
      }
      
      const messages = await storage.getMessagesByBrowserId(browserId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to retrieve messages" });
    }
  });
  
  // Send chat message
  app.post("/api/messages", async (req, res) => {
    try {
      const browserId = req.cookies.browserId;
      if (!browserId) {
        return res.status(400).json({ message: "Browser ID not found" });
      }
      
      const messageData = insertMessageSchema.parse({
        ...req.body,
        browserId
      });
      
      // Save user message
      const userMessage = await storage.createMessage(messageData);
      
      // Generate and save bot response
      setTimeout(async () => {
        try {
          // Skip OpenAI completely and use our static rule-based responses
          console.log("Processing chat message:", messageData.content);
          const botResponseText = getStaticResponse(messageData.content);
          console.log("Generated static response:", botResponseText);
          
          const botMessageData = {
            browserId,
            content: botResponseText,
            sender: 'support'
          };
          
          const botMessage = await storage.createMessage(botMessageData);
          
          // Broadcast the bot message to connected WebSocket clients
          if (wss) {
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'chat',
                  message: botMessage
                }));
              }
            });
          }
        } catch (error) {
          console.error("Error generating response:", error);
          
          // Ultimate fallback if everything else fails
          const fallbackResponse = "Our chat service is currently experiencing technical difficulties. Please try again later or contact our support team directly at support@globalbusinesspay.com for assistance.";
          
          const fallbackMessageData = {
            browserId,
            content: fallbackResponse,
            sender: 'support'
          };
          
          const fallbackMessage = await storage.createMessage(fallbackMessageData);
          
          // Broadcast the fallback message
          if (wss) {
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'chat',
                  message: fallbackMessage
                }));
              }
            });
          }
        }
      }, 1000); // Slight delay to make the response feel more natural
      
      res.status(201).json(userMessage);
    } catch (error) {
      console.error("Error creating message:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create message" });
    }
  });
  
  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password || user.role !== 'admin') {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set session
      if (req.session) {
        req.session.userId = user.id;
        req.session.role = user.role;
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  // Admin middleware to check session
  const adminAuth = async (req: Request, res: Response, next: Function) => {
    if (!req.session || !req.session.userId || req.session.role !== 'admin') {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };
  
  // Get all orders (admin only)
  app.get("/api/admin/orders", adminAuth, async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to retrieve orders" });
    }
  });
  
  // Update card price (admin only)
  app.patch("/api/admin/cards/:id", adminAuth, async (req, res) => {
    try {
      const cardId = parseInt(req.params.id);
      const { priceBNB } = req.body;
      
      if (typeof priceBNB !== 'number' || priceBNB <= 0) {
        return res.status(400).json({ message: "Invalid price" });
      }
      
      const updatedCard = await storage.updateCard(cardId, { priceBNB });
      if (!updatedCard) {
        return res.status(404).json({ message: "Card not found" });
      }
      
      res.json(updatedCard);
    } catch (error) {
      console.error("Error updating card:", error);
      res.status(500).json({ message: "Failed to update card" });
    }
  });
  
  // Update BNB price (admin only)
  app.post("/api/admin/bnb-price", adminAuth, async (req, res) => {
    try {
      const { price } = req.body;
      
      if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ message: "Invalid price" });
      }
      
      const settings = await storage.updateBNBPrice(price);
      res.json(settings);
    } catch (error) {
      console.error("Error updating BNB price:", error);
      res.status(500).json({ message: "Failed to update BNB price" });
    }
  });
  
  // Refresh all cryptocurrency prices (admin only)
  app.post("/api/admin/refresh-crypto-prices", adminAuth, async (req, res) => {
    try {
      console.log("Manual refresh of cryptocurrency prices triggered by admin");
      await updateCryptoPrices();
      
      // Fetch all updated cryptocurrencies to return in the response
      const cryptos = await storage.getAllCryptocurrencies();
      
      res.json({
        message: "Cryptocurrency prices refreshed successfully",
        timestamp: new Date(),
        cryptocurrencies: cryptos
      });
    } catch (error) {
      console.error("Error refreshing cryptocurrency prices:", error);
      res.status(500).json({ message: "Failed to refresh cryptocurrency prices" });
    }
  });
  
  // Get all chat conversations (admin only)
  app.get("/api/admin/chats", adminAuth, async (req, res) => {
    try {
      const allMessages = Array.from(new Set([
        // Get all unique browser IDs
      ]));
      
      res.json(allMessages);
    } catch (error) {
      console.error("Error fetching chats:", error);
      res.status(500).json({ message: "Failed to retrieve chats" });
    }
  });
  
  // AI card recommendation based on user needs
  app.post("/api/recommend-card", async (req, res) => {
    try {
      const { userNeeds } = req.body;
      
      if (!userNeeds || typeof userNeeds !== "string") {
        return res.status(400).json({ message: "User needs must be provided as a string" });
      }
      
      // Generate recommendation using OpenAI
      const recommendation = await generateCardRecommendation(userNeeds);
      
      res.json(recommendation);
    } catch (error) {
      console.error("Error generating card recommendation:", error);
      res.status(500).json({ message: "Failed to generate card recommendation" });
    }
  });
  
  // Get all cryptocurrencies
  app.get("/api/cryptocurrencies", async (req, res) => {
    try {
      const cryptocurrencies = await storage.getAllCryptocurrencies();
      res.json(cryptocurrencies);
    } catch (error) {
      console.error("Error fetching cryptocurrencies:", error);
      res.status(500).json({ message: "Failed to retrieve cryptocurrencies" });
    }
  });
  
  // Get active cryptocurrencies
  app.get("/api/active-cryptocurrencies", async (req, res) => {
    try {
      const cryptocurrencies = await storage.getActiveCryptocurrencies();
      res.json(cryptocurrencies);
    } catch (error) {
      console.error("Error fetching active cryptocurrencies:", error);
      res.status(500).json({ message: "Failed to retrieve active cryptocurrencies" });
    }
  });
  
  // Admin routes for cryptocurrency management
  app.post("/api/admin/cryptocurrencies", adminAuth, async (req, res) => {
    try {
      const { name, symbol, usdPrice, address } = req.body;
      
      if (!name || !symbol || typeof usdPrice !== 'number' || !address) {
        return res.status(400).json({ message: "Invalid cryptocurrency data" });
      }
      
      const cryptoData = {
        name,
        symbol,
        usdPrice,
        address,
        isActive: true
      };
      
      const newCrypto = await storage.createCryptocurrency(cryptoData);
      res.status(201).json(newCrypto);
    } catch (error) {
      console.error("Error creating cryptocurrency:", error);
      res.status(500).json({ message: "Failed to create cryptocurrency" });
    }
  });
  
  app.patch("/api/admin/cryptocurrencies/:id", adminAuth, async (req, res) => {
    try {
      const cryptoId = parseInt(req.params.id);
      const { name, symbol, usdPrice, address, isActive } = req.body;
      
      const updateData: any = {};
      
      if (name) updateData.name = name;
      if (symbol) updateData.symbol = symbol;
      if (typeof usdPrice === 'number') updateData.usdPrice = usdPrice;
      if (address) updateData.address = address;
      if (typeof isActive === 'boolean') updateData.isActive = isActive;
      
      const updatedCrypto = await storage.updateCryptocurrency(cryptoId, updateData);
      
      if (!updatedCrypto) {
        return res.status(404).json({ message: "Cryptocurrency not found" });
      }
      
      res.json(updatedCrypto);
    } catch (error) {
      console.error("Error updating cryptocurrency:", error);
      res.status(500).json({ message: "Failed to update cryptocurrency" });
    }
  });
  
  return httpServer;
}
