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
  generator: 'v0.dev'
};
