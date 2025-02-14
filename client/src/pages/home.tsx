import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertTaskSchema, agentTypes } from "@shared/schema";
import type { InsertTask } from "@shared/schema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => setWalletAddress(accounts[0] || null));

      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setWalletAddress(accounts[0] || null);
      });
    }
  }, []);

  const form = useForm<InsertTask>({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      input: "",
      agentType: "Indexing",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertTask) => {
      const res = await apiRequest("POST", "/api/submit-task", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Task Submitted",
        description: "Your task has been submitted successfully",
      });
      form.reset();
      // Invalidate the tasks query to refresh the task history
      if (walletAddress) {
        queryClient.invalidateQueries({ queryKey: [`/api/tasks/${walletAddress}`] });
      }
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertTask) => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate({ ...data, walletAddress });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Submit AI Agent Task</CardTitle>
        </CardHeader>
        <CardContent>
          {!walletAddress ? (
            <p className="text-muted-foreground mb-4">Please connect your wallet to submit tasks.</p>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="agentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>AI Agent Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an agent" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {agentTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="input"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Input</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Enter task details..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full"
                >
                  {mutation.isPending ? "Submitting..." : "Submit Task"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}