import { 
  cards, type Card, type InsertCard,
  orders, type Order, type InsertOrder,
  messages, type Message, type InsertMessage,
  settings, type Settings, type InsertSettings,
  users, type User, type InsertUser,
  cryptocurrencies, type Cryptocurrency, type InsertCryptocurrency,
  fileStorage, type FileStorage, type InsertFileStorage
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Card operations
  getAllCards(): Promise<Card[]>;
  getCardById(id: number): Promise<Card | undefined>;
  createCard(card: InsertCard): Promise<Card>;
  updateCard(id: number, card: Partial<InsertCard>): Promise<Card | undefined>;
  
  // Order operations
  getAllOrders(): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Message operations
  getMessagesByBrowserId(browserId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // File storage operations
  storeFile(fileName: string, originalName: string, mimeType: string, data: Buffer): Promise<FileStorage>;
  getFileById(id: number): Promise<FileStorage | undefined>;
  
  // Cryptocurrency operations
  getAllCryptocurrencies(): Promise<Cryptocurrency[]>;
  getActiveCryptocurrencies(): Promise<Cryptocurrency[]>;
  getCryptocurrencyBySymbol(symbol: string): Promise<Cryptocurrency | undefined>;
  createCryptocurrency(crypto: InsertCryptocurrency): Promise<Cryptocurrency>;
  updateCryptocurrency(id: number, crypto: Partial<InsertCryptocurrency>): Promise<Cryptocurrency | undefined>;
  updateCryptocurrencyPrice(symbol: string, price: number): Promise<Cryptocurrency | undefined>;
  
  // Settings operations
  getSettings(): Promise<Settings | undefined>;
  updateSettings(settings: Partial<InsertSettings>): Promise<Settings>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cards: Map<number, Card>;
  private orders: Map<number, Order>;
  private messages: Map<number, Message>;
  private files: Map<number, FileStorage>;
  private cryptos: Map<number, Cryptocurrency>;
  private settings: Settings | undefined;
  
  private currentUserId: number;
  private currentCardId: number;
  private currentOrderId: number;
  private currentMessageId: number;
  private currentFileId: number;
  private currentCryptoId: number;
  private currentSettingsId: number;

  constructor() {
    // Initialize data stores
    this.users = new Map();
    this.cards = new Map();
    this.orders = new Map();
    this.messages = new Map();
    this.files = new Map();
    this.cryptos = new Map();
    
    // Initialize ID counters
    this.currentUserId = 1;
    this.currentCardId = 1;
    this.currentOrderId = 1;
    this.currentMessageId = 1;
    this.currentFileId = 1;
    this.currentCryptoId = 1;
    this.currentSettingsId = 1;
    
    // Create admin user
    this.createUser({
      username: 'admin',
      password: 'admin123',
      role: 'admin'
    });
    
    // Initialize cryptocurrencies
    this.initializeCryptocurrencies();
    
    // Create initial cards
    this.initializeCards();
    
    // Initialize settings
    this.settings = {
      id: this.currentSettingsId++,
      defaultCrypto: 'BNB',
      lastUpdated: new Date()
    };
  }

  private initializeCryptocurrencies() {
    const cryptoData: InsertCryptocurrency[] = [
      {
        name: "Binance Coin",
        symbol: "BNB",
        usdPrice: 605.30,
        address: "0xf8F9a26aDaEba581099425eCF3Bd52BD19C19e79",
        isActive: true
      },
      {
        name: "Bitcoin",
        symbol: "BTC",
        usdPrice: 62541.20,
        address: "bc1qqekeu35xdqfdnscgdpk2xshhzcaku236wwpsd8",
        isActive: true
      },
      {
        name: "Ethereum",
        symbol: "ETH",
        usdPrice: 3051.80,
        address: "0xf8F9a26aDaEba581099425eCF3Bd52BD19C19e79",
        isActive: true
      },
      {
        name: "Tron",
        symbol: "TRX",
        usdPrice: 0.1183,
        address: "TBUdsnLerVjPnxHahrJnNJmpcJ75c9Kr1e",
        isActive: true
      }
    ];
    
    cryptoData.forEach(crypto => this.createCryptocurrency(crypto));
  }

  private initializeCards() {
    const baseCards = [
      {
        name: "Basic Premium Visa",
        description: "Entry level card with essential benefits",
        basePrice: 500.00,
        imageUrl: "https://i.imgur.com/MxMIwJb.png"
      },
      {
        name: "Gold Visa",
        description: "Premium card with enhanced benefits",
        basePrice: 1000.00,
        imageUrl: "https://i.imgur.com/ZKlpSSb.jpg"
      },
      {
        name: "Platinum Visa",
        description: "Exclusive card with premium benefits",
        basePrice: 1500.00,
        imageUrl: "https://i.imgur.com/egjhEpm.png"
      },
      {
        name: "World Visa",
        description: "Global acceptance with exclusive perks",
        basePrice: 2000.00,
        imageUrl: "https://i.imgur.com/u8Q6OlU.png"
      },
      {
        name: "World Elite Visa",
        description: "Elite status with maximum benefits",
        basePrice: 2500.00,
        imageUrl: "https://i.imgur.com/hZMQes2.png"
      },
      {
        name: "Business Visa",
        description: "Designed for business expenses with premium features",
        basePrice: 3000.00,
        imageUrl: "https://i.imgur.com/BXk3lZ8.jpg"
      }
    ];
    
    // Calculate prices in different cryptocurrencies
    const cryptos = Array.from(this.cryptos.values());
    baseCards.forEach(card => {
      const cryptoPrices: Record<string, number> = {};
      cryptos.forEach(crypto => {
        cryptoPrices[crypto.symbol] = parseFloat((card.basePrice / crypto.usdPrice).toFixed(8));
      });
      
      this.createCard({
        ...card,
        cryptoPrices
      });
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      role: insertUser.role || 'user' 
    };
    this.users.set(id, user);
    return user;
  }
  
  // Card operations
  async getAllCards(): Promise<Card[]> {
    return Array.from(this.cards.values());
  }
  
  async getCardById(id: number): Promise<Card | undefined> {
    return this.cards.get(id);
  }
  
  async createCard(insertCard: InsertCard): Promise<Card> {
    const id = this.currentCardId++;
    const card: Card = { 
      ...insertCard, 
      id,
      description: insertCard.description || null,
      cryptoPrices: insertCard.cryptoPrices || {}
    };
    this.cards.set(id, card);
    return card;
  }
  
  async updateCard(id: number, cardData: Partial<InsertCard>): Promise<Card | undefined> {
    const card = this.cards.get(id);
    if (!card) return undefined;
    
    const updatedCard: Card = { ...card, ...cardData };
    this.cards.set(id, updatedCard);
    return updatedCard;
  }
  
  // Order operations
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }
  
  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { 
      ...insertOrder, 
      id, 
      createdAt: new Date(),
      status: insertOrder.status || 'pending',
      receiptUrl: insertOrder.receiptUrl || null
    };
    this.orders.set(id, order);
    return order;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder: Order = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  
  // Message operations
  async getMessagesByBrowserId(browserId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.browserId === browserId)
      .sort((a, b) => {
        const timeA = a.timestamp ? a.timestamp.getTime() : 0;
        const timeB = b.timestamp ? b.timestamp.getTime() : 0;
        return timeA - timeB;
      });
  }
  
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = { ...insertMessage, id, timestamp: new Date() };
    this.messages.set(id, message);
    return message;
  }
  
  // File storage operations
  async storeFile(fileName: string, originalName: string, mimeType: string, data: Buffer): Promise<FileStorage> {
    const id = this.currentFileId++;
    const base64Data = data.toString('base64');
    
    const file: FileStorage = {
      id,
      fileName,
      originalName,
      mimeType,
      size: data.length,
      data: base64Data,
      createdAt: new Date()
    };
    
    this.files.set(id, file);
    return file;
  }
  
  async getFileById(id: number): Promise<FileStorage | undefined> {
    return this.files.get(id);
  }
  
  // Cryptocurrency operations
  async getAllCryptocurrencies(): Promise<Cryptocurrency[]> {
    return Array.from(this.cryptos.values());
  }
  
  async getActiveCryptocurrencies(): Promise<Cryptocurrency[]> {
    return Array.from(this.cryptos.values()).filter(crypto => crypto.isActive);
  }
  
  async getCryptocurrencyBySymbol(symbol: string): Promise<Cryptocurrency | undefined> {
    return Array.from(this.cryptos.values()).find(crypto => crypto.symbol === symbol);
  }
  
  async createCryptocurrency(crypto: InsertCryptocurrency): Promise<Cryptocurrency> {
    const id = this.currentCryptoId++;
    const newCrypto: Cryptocurrency = {
      ...crypto,
      id,
      isActive: crypto.isActive !== undefined ? crypto.isActive : true,
      lastUpdated: new Date()
    };
    this.cryptos.set(id, newCrypto);
    return newCrypto;
  }
  
  async updateCryptocurrency(id: number, crypto: Partial<InsertCryptocurrency>): Promise<Cryptocurrency | undefined> {
    const existingCrypto = this.cryptos.get(id);
    if (!existingCrypto) return undefined;
    
    const updatedCrypto: Cryptocurrency = {
      ...existingCrypto,
      ...crypto,
      lastUpdated: new Date()
    };
    
    this.cryptos.set(id, updatedCrypto);
    return updatedCrypto;
  }
  
  async updateCryptocurrencyPrice(symbol: string, price: number): Promise<Cryptocurrency | undefined> {
    const crypto = Array.from(this.cryptos.values()).find(c => c.symbol === symbol);
    if (!crypto) return undefined;
    
    const updatedCrypto: Cryptocurrency = {
      ...crypto,
      usdPrice: price,
      lastUpdated: new Date()
    };
    
    this.cryptos.set(crypto.id, updatedCrypto);
    return updatedCrypto;
  }
  
  // Settings operations
  async getSettings(): Promise<Settings | undefined> {
    return this.settings;
  }
  
  async updateSettings(settingsData: Partial<InsertSettings>): Promise<Settings> {
    if (!this.settings) {
      this.settings = {
        id: this.currentSettingsId++,
        defaultCrypto: settingsData.defaultCrypto || 'BNB',
        lastUpdated: new Date()
      };
    } else {
      this.settings = {
        ...this.settings,
        ...settingsData,
        lastUpdated: new Date()
      };
    }
    return this.settings;
  }
  
  // Legacy method for backward compatibility
  async updateBNBPrice(price: number): Promise<Settings> {
    const bnbCrypto = await this.getCryptocurrencyBySymbol('BNB');
    if (bnbCrypto) {
      await this.updateCryptocurrencyPrice('BNB', price);
    }
    return this.updateSettings({});
  }
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Card operations
  async getAllCards(): Promise<Card[]> {
    return db.select().from(cards);
  }
  
  async getCardById(id: number): Promise<Card | undefined> {
    const [card] = await db.select().from(cards).where(eq(cards.id, id));
    return card || undefined;
  }
  
  async createCard(insertCard: InsertCard): Promise<Card> {
    const [card] = await db
      .insert(cards)
      .values(insertCard)
      .returning();
    return card;
  }
  
  async updateCard(id: number, cardData: Partial<InsertCard>): Promise<Card | undefined> {
    const [updatedCard] = await db
      .update(cards)
      .set(cardData)
      .where(eq(cards.id, id))
      .returning();
    return updatedCard || undefined;
  }
  
  // Order operations
  async getAllOrders(): Promise<Order[]> {
    return db.select().from(orders);
  }
  
  async getOrderById(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }
  
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
    return order;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder || undefined;
  }
  
  // File storage operations
  async storeFile(fileName: string, originalName: string, mimeType: string, data: Buffer): Promise<FileStorage> {
    // Convert buffer to base64 string for storage
    const base64Data = data.toString('base64');
    
    const [file] = await db
      .insert(fileStorage)
      .values({
        fileName,
        originalName,
        mimeType,
        size: data.length,
        data: base64Data
      })
      .returning();
    
    return file;
  }
  
  async getFileById(id: number): Promise<FileStorage | undefined> {
    const [file] = await db.select().from(fileStorage).where(eq(fileStorage.id, id));
    return file || undefined;
  }
  
  // Cryptocurrency operations
  async getAllCryptocurrencies(): Promise<Cryptocurrency[]> {
    return db.select().from(cryptocurrencies);
  }
  
  async getActiveCryptocurrencies(): Promise<Cryptocurrency[]> {
    return db.select().from(cryptocurrencies).where(eq(cryptocurrencies.isActive, true));
  }
  
  async getCryptocurrencyBySymbol(symbol: string): Promise<Cryptocurrency | undefined> {
    const [crypto] = await db.select().from(cryptocurrencies).where(eq(cryptocurrencies.symbol, symbol));
    return crypto || undefined;
  }
  
  async createCryptocurrency(crypto: InsertCryptocurrency): Promise<Cryptocurrency> {
    const [newCrypto] = await db
      .insert(cryptocurrencies)
      .values(crypto)
      .returning();
    return newCrypto;
  }
  
  async updateCryptocurrency(id: number, crypto: Partial<InsertCryptocurrency>): Promise<Cryptocurrency | undefined> {
    const [updatedCrypto] = await db
      .update(cryptocurrencies)
      .set({
        ...crypto,
        lastUpdated: new Date()
      })
      .where(eq(cryptocurrencies.id, id))
      .returning();
    return updatedCrypto || undefined;
  }
  
  async updateCryptocurrencyPrice(symbol: string, price: number): Promise<Cryptocurrency | undefined> {
    const [crypto] = await db
      .update(cryptocurrencies)
      .set({
        usdPrice: price,
        lastUpdated: new Date()
      })
      .where(eq(cryptocurrencies.symbol, symbol))
      .returning();
    return crypto || undefined;
  }
  
  // Message operations
  async getMessagesByBrowserId(browserId: string): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .where(eq(messages.browserId, browserId))
      .orderBy(messages.timestamp);
  }
  
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }
  
  // Settings operations
  async getSettings(): Promise<Settings | undefined> {
    const [setting] = await db.select().from(settings);
    return setting || undefined;
  }
  
  async updateSettings(settingsData: Partial<InsertSettings>): Promise<Settings> {
    const existingSettings = await this.getSettings();
    
    if (!existingSettings) {
      // If no settings exist, create a new one
      const [newSettings] = await db
        .insert(settings)
        .values({
          ...settingsData,
          defaultCrypto: settingsData.defaultCrypto || 'BNB'
        })
        .returning();
      return newSettings;
    } else {
      // Otherwise update the existing one
      const [updatedSettings] = await db
        .update(settings)
        .set({ 
          ...settingsData,
          lastUpdated: new Date()
        })
        .where(eq(settings.id, existingSettings.id))
        .returning();
      return updatedSettings;
    }
  }
  
  // Legacy method for backward compatibility
  async updateBNBPrice(price: number): Promise<Settings> {
    const bnbCrypto = await this.getCryptocurrencyBySymbol('BNB');
    if (bnbCrypto) {
      await this.updateCryptocurrencyPrice('BNB', price);
    }
    return this.updateSettings({});
  }
}

// Initialize the database with seed data
async function initializeDatabase() {
  try {
    // Check if admin user exists
    const adminUser = await db
      .select()
      .from(users)
      .where(eq(users.username, 'admin'));
    
    // Create admin user if it doesn't exist
    if (adminUser.length === 0) {
      await db.insert(users).values({
        username: 'admin',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin user created');
    }
    
    // Initialize cryptocurrencies if none exist
    const cryptoCount = await db.select().from(cryptocurrencies);
    if (cryptoCount.length === 0) {
      const cryptoData = [
        {
          name: "Binance Coin",
          symbol: "BNB",
          usdPrice: 605.30,
          address: "0xf8F9a26aDaEba581099425eCF3Bd52BD19C19e79",
          isActive: true
        },
        {
          name: "Bitcoin",
          symbol: "BTC",
          usdPrice: 62541.20,
          address: "bc1qqekeu35xdqfdnscgdpk2xshhzcaku236wwpsd8",
          isActive: true
        },
        {
          name: "Ethereum",
          symbol: "ETH",
          usdPrice: 3051.80,
          address: "0xf8F9a26aDaEba581099425eCF3Bd52BD19C19e79",
          isActive: true
        },
        {
          name: "Tron",
          symbol: "TRX",
          usdPrice: 0.1183,
          address: "TBUdsnLerVjPnxHahrJnNJmpcJ75c9Kr1e",
          isActive: true
        }
      ];
      
      await db.insert(cryptocurrencies).values(cryptoData);
      console.log('Cryptocurrencies created');
    }
    
    // Check if cards exist
    const cardCount = await db.select().from(cards);
    
    // Seed cards if none exist
    if (cardCount.length === 0) {
      const baseCards = [
        {
          name: "Basic Premium Visa",
          description: "Entry level card with essential benefits",
          basePrice: 500.00,
          imageUrl: "https://i.imgur.com/MxMIwJb.png"
        },
        {
          name: "Gold Visa",
          description: "Premium card with enhanced benefits",
          basePrice: 1000.00,
          imageUrl: "https://i.imgur.com/ZKlpSSb.jpg"
        },
        {
          name: "Platinum Visa",
          description: "Exclusive card with premium benefits",
          basePrice: 1500.00,
          imageUrl: "https://i.imgur.com/egjhEpm.png"
        },
        {
          name: "World Visa",
          description: "Global acceptance with exclusive perks",
          basePrice: 2000.00,
          imageUrl: "https://i.imgur.com/u8Q6OlU.png"
        },
        {
          name: "World Elite Visa",
          description: "Elite status with maximum benefits",
          basePrice: 2500.00,
          imageUrl: "https://i.imgur.com/hZMQes2.png"
        },
        {
          name: "Business Visa",
          description: "Designed for business expenses with premium features",
          basePrice: 3000.00,
          imageUrl: "https://i.imgur.com/BXk3lZ8.jpg"
        }
      ];
      
      // Calculate prices in different cryptocurrencies
      const cryptos = await db.select().from(cryptocurrencies);
      const cardData = baseCards.map(card => {
        const cryptoPrices: Record<string, number> = {};
        cryptos.forEach(crypto => {
          cryptoPrices[crypto.symbol] = parseFloat((card.basePrice / crypto.usdPrice).toFixed(8));
        });
        
        return {
          ...card,
          cryptoPrices
        };
      });
      
      await db.insert(cards).values(cardData);
      console.log('Cards created');
    }
    
    // Initialize settings if none exist
    const settingsCount = await db.select().from(settings);
    if (settingsCount.length === 0) {
      await db.insert(settings).values({
        defaultCrypto: 'BNB'
      });
      console.log('Settings created');
    }
    
    console.log('Database successfully initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Initialize the database and export the storage implementation
// Commenting out database initialization due to connection issues
// initializeDatabase().catch(console.error);
// export const storage = new DatabaseStorage();

// Using in-memory storage instead
export const storage = new MemStorage();
