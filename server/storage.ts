import { tasks, type Task, type InsertTask } from "@shared/schema";

export interface IStorage {
  createTask(task: InsertTask): Promise<Task>;
  getTasksByWallet(walletAddress: string): Promise<Task[]>;
  updateTaskStatus(id: number, status: string, result?: string, txHash?: string): Promise<Task>;
}

export class MemStorage implements IStorage {
  private tasks: Map<number, Task>;
  private currentId: number;

  constructor() {
    this.tasks = new Map();
    this.currentId = 1;
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentId++;
    const task: Task = {
      ...insertTask,
      id,
      status: "pending",
      result: null,
      txHash: null,
      timestamp: new Date()
    };
    this.tasks.set(id, task);
    return task;
  }

  async getTasksByWallet(walletAddress: string): Promise<Task[]> {
    return Array.from(this.tasks.values())
      .filter(task => task.walletAddress.toLowerCase() === walletAddress.toLowerCase())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async updateTaskStatus(id: number, status: string, result?: string, txHash?: string): Promise<Task> {
    const task = this.tasks.get(id);
    if (!task) {
      throw new Error("Task not found");
    }
    const updatedTask = { ...task, status, result, txHash };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }
}

export const storage = new MemStorage();
