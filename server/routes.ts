import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, taskStatuses } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  app.post("/api/submit-task", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);

      // Simulate async processing with more detailed responses
      setTimeout(async () => {
        await storage.updateTaskStatus(
          task.id, 
          "processing",
          "Initializing multi-agent coordination for complex task processing..."
        );

        // First stage - Indexing
        setTimeout(async () => {
          if (task.input.toLowerCase().includes("index")) {
            await storage.updateTaskStatus(
              task.id,
              "processing",
              "Indexing transactions for contract 0xA1B2C3: 23% complete. Retrieved historical data blocks."
            );
          }
        }, 2000);

        // Second stage - Query Optimization
        setTimeout(async () => {
          if (task.input.toLowerCase().includes("query")) {
            await storage.updateTaskStatus(
              task.id,
              "processing",
              "Optimizing query patterns: 67% complete. Analyzing gas usage patterns and creating efficient data retrieval strategy."
            );
          }
        }, 4000);

        // Third stage - Transaction Batching
        setTimeout(async () => {
          if (task.input.toLowerCase().includes("batch")) {
            await storage.updateTaskStatus(
              task.id,
              "processing",
              "Preparing transaction batch: 89% complete. Estimated gas savings: 32%."
            );
          }
        }, 6000);

        // Final stage - Completion
        setTimeout(async () => {
          const success = Math.random() > 0.1; // 90% success rate
          const status = success ? "completed" : "failed";

          let result;
          if (success) {
            result = `Task completed successfully:\n` +
              `- Indexed 1,247 transactions for contract 0xA1B2C3\n` +
              `- Optimized query patterns reducing data retrieval latency by 47%\n` +
              `- Batched 8 pending transactions, estimated gas savings: 0.023 ETH`;
          } else {
            result = "Task failed: Unable to complete transaction batching due to network congestion";
          }

          const txHash = success ? `0x${Math.random().toString(16).slice(2)}` : undefined;
          await storage.updateTaskStatus(task.id, status, result, txHash);
        }, 8000);
      }, 1000);

      res.json(task);
    } catch (error) {
      res.status(400).json({ error: "Invalid task data" });
    }
  });

  app.get("/api/tasks/:walletAddress", async (req, res) => {
    try {
      const tasks = await storage.getTasksByWallet(req.params.walletAddress);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}