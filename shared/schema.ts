import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull(),
  agentType: text("agent_type").notNull(),
  input: text("input").notNull(),
  status: text("status").notNull().default("pending"),
  result: text("result"),
  txHash: text("tx_hash"),
  timestamp: timestamp("timestamp").notNull().defaultNow()
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  timestamp: true,
  status: true,
  result: true,
  txHash: true
});

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export const agentTypes = [
  "Indexing",
  "Query Optimization", 
  "Transaction Batching"
] as const;

export const taskStatuses = [
  "pending",
  "processing",
  "completed",
  "failed"
] as const;
