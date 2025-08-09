import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import Providers from "./providers"; 

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}

export const metadata = {
  title: "IPVerse",
  description: "Decentralized platform for investing in and managing IP assets. Browse projects, track investments, and manage your profile securely on the Base Camp network.",
  generator: "v0.dev",
  keywords: [
    "IPVerse",
    "Web3",
    "IP Tokenization",
    "User Dashboard",
    "Blockchain",
    "Investments",
    "Base Camp Network"
  ],
  authors: [{ name: "IPVerse Team" }],
  themeColor: "#6366f1",
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  }
};
