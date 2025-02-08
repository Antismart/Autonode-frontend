import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { connectWallet, shortenAddress } from "@/lib/web3";
import { useToast } from "@/hooks/use-toast";

export default function ConnectWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      const addr = await connectWallet();
      setAddress(addr);
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your wallet",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setAddress(accounts[0] || null);
      });
    }
  }, []);

  return (
    <Button 
      variant={address ? "outline" : "default"}
      onClick={handleConnect}
    >
      {address ? shortenAddress(address) : "Connect Wallet"}
    </Button>
  );
}
