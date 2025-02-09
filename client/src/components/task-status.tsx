import { Badge } from "@/components/ui/badge";
import { taskStatuses } from "@shared/schema";
import type { Task } from "@shared/schema";

const statusColors: Record<typeof taskStatuses[number], string> = {
  pending: "bg-yellow-500",
  processing: "bg-blue-500",
  completed: "bg-green-500",
  failed: "bg-red-500"
};

export default function TaskStatus({ task }: { task: Task }) {
  return (
    <div className="space-y-2">
      <Badge className={statusColors[task.status as typeof taskStatuses[number]]}>
        {task.status.toUpperCase()}
      </Badge>
      {task.result && (
        <div className="text-sm text-muted-foreground whitespace-pre-line">
          {task.result}
        </div>
      )}
      {task.txHash && (
        <a
          href={`https://etherscan.io/tx/${task.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline block mt-1"
        >
          View Transaction
        </a>
      )}
    </div>
  );
}