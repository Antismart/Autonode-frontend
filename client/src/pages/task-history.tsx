import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Task } from "@shared/schema";
import TaskStatus from "@/components/task-status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

export default function TaskHistory() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Listen for wallet changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => setWalletAddress(accounts[0] || null));

      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setWalletAddress(accounts[0] || null);
      });
    }
  }, []);

  const query = useQuery<Task[]>({
    queryKey: [`/api/tasks/${walletAddress}`],
    enabled: !!walletAddress,
    refetchInterval: 2000, // Refetch every 2 seconds for real-time updates
  });

  if (!walletAddress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please connect your wallet to view task history.</p>
        </CardContent>
      </Card>
    );
  }

  if (query.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading tasks...</p>
        </CardContent>
      </Card>
    );
  }

  if (query.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Error: {(query.error as Error).message}</p>
        </CardContent>
      </Card>
    );
  }

  const tasks = query.data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task History</CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-muted-foreground">No tasks found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Agent Type</TableHead>
                <TableHead>Input</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{format(new Date(task.timestamp), "PPp")}</TableCell>
                  <TableCell>{task.agentType}</TableCell>
                  <TableCell className="max-w-md truncate">{task.input}</TableCell>
                  <TableCell>
                    <TaskStatus task={task} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}