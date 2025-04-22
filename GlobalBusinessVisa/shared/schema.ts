import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
});

export const cryptocurrencies = pgTable("cryptocurrencies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // 'BNB', 'BTC', 'ETH', 'TRON'
  symbol: text("symbol").notNull().unique(), // 'BNB', 'BTC', 'ETH', 'TRX'
  usdPrice: doublePrecision("usd_price").notNull(),
  address: text("address").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  basePrice: doublePrecision("base_price").notNull(), // Price in USD
  cryptoPrices: jsonb("crypto_prices").notNull().default({}), // JSON field to store prices in different cryptocurrencies
  imageUrl: text("image_url").notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  cardId: integer("card_id").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  gbpId: text("gbp_id"), // Made optional
  accountNumber: text("account_number").notNull(),
  receiptUrl: text("receipt_url"),
  cryptoSymbol: text("crypto_symbol"), // Made optional
  cryptoAmount: doublePrecision("crypto_amount"), // Made optional
  cryptoAddress: text("crypto_address"), // Made optional
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const fileStorage = pgTable("file_storage", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  data: text("data").notNull(), // Base64 encoded file data
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  browserId: text("browser_id").notNull(),
  content: text("content").notNull(),
  sender: text("sender").notNull(), // 'user' or 'admin'
  timestamp: timestamp("timestamp").defaultNow(),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  defaultCrypto: text("default_crypto").notNull().default("BNB"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export const insertCryptocurrencySchema = createInsertSchema(cryptocurrencies).omit({
  id: true,
  lastUpdated: true,
});

export const insertCardSchema = createInsertSchema(cards).pick({
  name: true,
  description: true,
  basePrice: true,
  cryptoPrices: true,
  imageUrl: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertFileStorageSchema = createInsertSchema(fileStorage).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
  lastUpdated: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCryptocurrency = z.infer<typeof insertCryptocurrencySchema>;
export type Cryptocurrency = typeof cryptocurrencies.$inferSelect;

export type InsertCard = z.infer<typeof insertCardSchema>;
export type Card = typeof cards.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertFileStorage = z.infer<typeof insertFileStorageSchema>;
export type FileStorage = typeof fileStorage.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;
