import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, taskStatuses } from "@shared/schema";
import { AutonodeAgent } from "./agent";

export function registerRoutes(app: Express): Server {
  app.post("/api/submit-task", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);

      // Initial response
      setTimeout(async () => {
        const initialResponse = AutonodeAgent.generateInitialResponse(task);
        await storage.updateTaskStatus(task.id, "processing", initialResponse);

        // Progressive updates
        setTimeout(async () => {
          const update = AutonodeAgent.generateProgressUpdate(task);
          await storage.updateTaskStatus(task.id, "processing", update.message);
        }, 3000);

        // Completion
        setTimeout(async () => {
          const success = Math.random() > 0.1; // 90% success rate
          const status = success ? "completed" : "failed";
          const result = AutonodeAgent.generateCompletionResponse(task, success);
          const txHash = success ? `0x${Math.random().toString(16).slice(2)}` : undefined;
          await storage.updateTaskStatus(task.id, status, result, txHash);
        }, 6000);
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