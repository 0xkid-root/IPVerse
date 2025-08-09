"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, User, LogOut, Menu } from "lucide-react";
import { useAuth, CampModal, useAuthState, useConnect, useModal } from "@campnetwork/origin/react";

interface AdminTopbarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function AdminTopbar({ isCollapsed, onToggleCollapse }: AdminTopbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [showConnectModal, setShowConnectModal] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const { authenticated, loading } = useAuthState();
  const { connect, disconnect } = useConnect();
  const { openModal } = useModal(); 

  console.log("connect is here ::",connect);

  // Log authentication state and modal actions for debugging
  useEffect(() => {
    console.log("Authenticated:", authenticated);
    console.log("Loading:", loading);
    console.log("Show Connect Modal:", showConnectModal);
    if (!authenticated) {
      localStorage.removeItem("walletAddress");
    } else if (auth.walletAddress) {
      localStorage.setItem("walletAddress", auth.walletAddress);
    }
  }, [authenticated, loading, auth.walletAddress, showConnectModal]);

  // Single useEffect to handle initial state
  useEffect(() => {
    const storedName = localStorage.getItem("adminName") || "Admin";
    setAdminName(storedName);
  }, []);

  const handleLogout = async () => {
    try {
      await disconnect();
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("adminName");
      localStorage.removeItem("walletAddress");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const displayWalletAddress = authenticated && auth.walletAddress
    ? `${auth.walletAddress.slice(0, 6)}...${auth.walletAddress.slice(-4)}`
    : "";

  // Handle opening the modal
  const handleConnectClick = () => {
    console.log("Opening connect modal...");
    openModal(); 
    setShowConnectModal(true); 
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Collapse toggle for desktop */}
        <div className="flex items-center">
          <button
            onClick={onToggleCollapse}
            className="flex lg:flex p-2 rounded-md hover:bg-gray-100 transition-colors mr-4"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Right side - Admin Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <span className="text-gray-700 font-medium">
              {adminName} {displayWalletAddress ? `| ${displayWalletAddress}` : ""}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  router.push("/dashboard/profile");
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <User className="mr-3 h-4 w-4" />
                Profile
              </button>
              {!authenticated && !loading && (
                <button
                  onClick={handleConnectClick}
                  className="flex items-center w-full px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50"
                >
                  Connect Wallet
                </button>
              )}
              {authenticated && !loading && (
                <button
                  onClick={async () => {
                    try {
                      await disconnect();
                    } catch (error) {
                      console.error("Disconnect error:", error);
                    }
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Disconnect
                </button>
              )}
              {loading && (
                <div className="flex items-center w-full px-4 py-2 text-sm text-gray-500">
                  Loading...
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Render CampModal with injectButton=false */}
      <CampModal injectButton={false} />
    </header>
  );
}