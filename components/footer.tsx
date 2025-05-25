"use client";
import Link from "next/link";

import { Earth, Github, Linkedin, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const { setTheme, theme } = useTheme();

  return (
    <footer className="sticky bottom-0 z-10 w-full border-t bg-background/80 backdrop-blur-md">
      <div className="container mx-auto max-w-screen-xl px-4 py-4 flex flex-col items-center">
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row w-full">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Peel the Net. All rights reserved.
            </p>
          </div>

          <div className="flex flex-1 justify-end items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-muted-foreground">
                All systems operational
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/0xpratikpatil"
                target="_blank"
                className="text-muted-foreground hover:text-foreground"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>

              <Link
                href="https://www.linkedin.com/in/0xpratikpatil/"
                target="_blank"
                className="text-muted-foreground hover:text-foreground"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="https://pratikpatil.me"
                target="_blank"
                className="text-muted-foreground hover:text-foreground"
              >
                <Earth className="h-5 w-5" />
                <span className="sr-only">Website</span>
              </Link>

              <Separator orientation="vertical" className="h-6 mx-1" />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="size-8"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
