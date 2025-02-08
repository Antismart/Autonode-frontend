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
  const query = useQuery<Task[]>({
    queryKey: ["/api/tasks/0x123"], // Replace with actual wallet address
    enabled: false, // Disabled until wallet is connected
  });

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  if (query.error) {
    return <div>Error: {(query.error as Error).message}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task History</CardTitle>
      </CardHeader>
      <CardContent>
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
            {query.data?.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{format(new Date(task.timestamp), "PPp")}</TableCell>
                <TableCell>{task.agentType}</TableCell>
                <TableCell>{task.input}</TableCell>
                <TableCell>
                  <TaskStatus task={task} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
