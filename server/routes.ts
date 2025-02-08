import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, taskStatuses } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  app.post("/api/submit-task", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      
      // Simulate async processing
      setTimeout(async () => {
        await storage.updateTaskStatus(task.id, "processing");
        
        // Simulate completion after 5-10 seconds
        setTimeout(async () => {
          const success = Math.random() > 0.2;
          const status = success ? "completed" : "failed";
          const result = success ? "Task completed successfully" : "Task failed";
          const txHash = success ? `0x${Math.random().toString(16).slice(2)}` : undefined;
          await storage.updateTaskStatus(task.id, status, result, txHash);
        }, 5000 + Math.random() * 5000);
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
