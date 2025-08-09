import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Vault } from "lucide-react";

export default function LandingHeader() {
  return (
    <header className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center py-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <Vault className="h-6 w-6 text-white" />
                      </div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        IPVerse
                      </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost">
                        <a href="/login" className="text-inherit no-underline">Login</a>
                      </Button>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <a href="/signup" className="text-inherit no-underline">Get Started</a>
                      </Button>
                    </div>
                  </div>
                </div>
    </header>
  );
}