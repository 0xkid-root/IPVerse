"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth as useMyAuth } from "@/contexts/auth-context"; // Renamed to avoid conflict
import { User, LogOut, Menu, Wallet } from "lucide-react";
import Link from "next/link";
import { useAuth, useAuthState, useConnect, useModal, } from "@campnetwork/origin/react";

interface EnhancedTopbarProps {
  onMenuClick: () => void;
  isCollapsed: boolean;
}

export function EnhancedTopbar({ onMenuClick, isCollapsed }: EnhancedTopbarProps) {
  const { user, logout, setUser } = useMyAuth();
  const auth = useAuth(); // SDK auth for wallet address
  const { authenticated, loading } = useAuthState();
  const { disconnect } = useConnect();
  const { openModal } = useModal();
  const router = useRouter();

  const [showConnectModal, setShowConnectModal] = useState(false);

  // Sync SDK auth state with localStorage and user context
  useEffect(() => {
    console.log("Authenticated:", authenticated);
    console.log("Loading:", loading);
    console.log("SDK Wallet Address:", auth.walletAddress);
    console.log("User Wallet Address:", user?.walletAddress);
    if (!authenticated) {
      localStorage.removeItem("walletAddress");
      if (user && user.walletAddress) {
        setUser({ ...user, walletAddress: undefined });
      }
    } else if (auth.walletAddress) {
      localStorage.setItem("walletAddress", auth.walletAddress);
      if (user && user.walletAddress !== auth.walletAddress) {
        setUser({ ...user, walletAddress: auth.walletAddress });
      }
    }
  }, [authenticated, loading, auth.walletAddress, user, setUser]);

  const handleLogout = async () => {
    try {
      await disconnect();
      logout();
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("adminName");
      localStorage.removeItem("walletAddress");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleConnectClick = () => {
    console.log("Opening connect modal...");
    if (openModal) {
      openModal();
    } else {
      console.error("openModal is undefined. Ensure CampModal is in the tree and CampProvider is active.");
    }
    setShowConnectModal(true);
  };

  const displayWalletAddress = authenticated && user?.walletAddress
    ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`
    : "";

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-2"
            onClick={onMenuClick}
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className={`transition-all duration-300 ${isCollapsed ? "lg:ml-0" : ""}`}>
            <h2 className="text-lg font-semibold text-gray-900">Welcome back, {user?.name}!</h2>
            <p className="text-sm text-gray-600">
              Ready to explore new investment opportunities? {displayWalletAddress ? `| Wallet: ${displayWalletAddress}` : ""}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt="User" />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-600">{user?.email} {displayWalletAddress ? `| ${displayWalletAddress}` : ""}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            {!authenticated && !loading && (
              <DropdownMenuItem onClick={handleConnectClick} className="flex items-center">
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </DropdownMenuItem>
            )}
            {authenticated && !loading && (
              <DropdownMenuItem
                onClick={async () => {
                  try {
                    await disconnect();
                  } catch (error) {
                    console.error("Disconnect error:", error);
                  }
                }}
                className="flex items-center"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Disconnect Wallet
              </DropdownMenuItem>
            )}
            {loading && (
              <DropdownMenuItem className="flex items-center" disabled>
                <span className="mr-2 h-4 w-4 animate-spin">Loading...</span>
                Connecting...
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleLogout} className="flex items-center">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}