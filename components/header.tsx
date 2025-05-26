"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

export const HeroHeader = () => {
  const pathname = usePathname();
  const isRelayPage = pathname === "/relay" || pathname.includes("/relay/");

  return (
    <header className="sticky top-0 z-20 w-full border-b bg-background/80 backdrop-blur-md">
      <nav className="py-3">
        <div className="container mx-auto max-w-screen-xl px-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              aria-label="home"
              className="flex items-center gap-2"
            >
              <span className="text-lg font-medium">Peel the Net</span>
            </Link>

            <div className="hidden md:flex items-center gap-4">
              {isRelayPage && (
                <Button variant="outline" size="sm" asChild>
                  <Link href="https://github.com/0xpratikpatil/peel-the-net/tree/main/dataset">
                    <Download className="mr-2 h-4 w-4" />
                    Download Dataset
                  </Link>
                </Button>
              )}

              <Button variant="ghost" size="sm" asChild>
                <Link
                  href="https://github.com/0xpratikpatil/peel-the-net"
                  target="_blank"
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
