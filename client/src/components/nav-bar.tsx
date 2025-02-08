import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import ConnectWallet from "./connect-wallet";

export default function NavBar() {
  const [location] = useLocation();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">AI Agents</span>
          </Link>
          <div className="flex items-center space-x-6 text-sm font-medium">
            <Link 
              href="/" 
              className={cn(
                "transition-colors hover:text-foreground/80",
                location === "/" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Submit Task
            </Link>
            <Link 
              href="/history" 
              className={cn(
                "transition-colors hover:text-foreground/80",
                location === "/history" ? "text-foreground" : "text-foreground/60"
              )}
            >
              History
            </Link>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ConnectWallet />
        </div>
      </div>
    </nav>
  );
}
