import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Peel the Net | Tor Network Explorer",
  description: "Explore and monitor the global network of Tor nodes with real-time data and comprehensive insights.",
  keywords: ["tor", "network", "explorer", "relay", "nodes", "monitoring"],
  authors: [{ name: "Pratik Patil" }],
};
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={spaceGrotesk.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
