"use client";

import * as React from "react";
import {
  Check,
  Search,
  Terminal,
  Copy,
  Github,
  FileText,
  Code,
  Package,
  ActivitySquare,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ServerSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const [packageManager, setPackageManager] = React.useState("npm");


  const getInstallCommand = () => {
    const commands = {
      npm: "npm install torlens",
      yarn: "yarn add torlens",
      pnpm: "pnpm add torlens",
      bun: "bun add torlens",
    };
    return commands[packageManager as keyof typeof commands];
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error("Failed to copy:", err));
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/relay/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid grid-cols-2 mb-3 rounded-xl overflow-hidden">
          <TabsTrigger
            value="search"
            className="data-[state=active]:bg-background/50 data-[state=active]:backdrop-blur-sm data-[state=active]:border-primary"
          >
            <Search className="mr-2 h-4 w-4" />
            Search Nodes
          </TabsTrigger>
          <TabsTrigger
            value="library"
            className="data-[state=active]:bg-background/50 data-[state=active]:backdrop-blur-sm data-[state=active]:border-primary"
          >
            <Code className="mr-2 h-4 w-4" />
            Node.js Library
          </TabsTrigger>
        </TabsList>
        <TabsContent value="search" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border backdrop-blur-md bg-background/40 shadow-lg rounded-xl overflow-hidden">
              <CardHeader className="bg-background/60 backdrop-blur-sm border-b">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Search className="h-5 w-5" />
                  Find Tor Server Nodes
                </CardTitle>
                <CardDescription>
                  Search our database of Tor nodes by host, fingerprint, or IP
                  address for real-time information
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex w-full items-center">
                    <div className="relative w-full">
                      <div className="flex items-center">
                        <Input
                          placeholder={`Search by host, fingerprint, or IP address...`}
                          className="rounded-l-none w-full bg-background/70"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSearch();
                            }
                          }}
                        />

                        <Button
                          className="ml-2 rounded-xl bg-primary text-primary-foreground"
                          onClick={handleSearch}
                        >
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        <TabsContent value="library" className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="w-full border bg-background/40 backdrop-blur-md shadow-lg rounded-xl overflow-hidden">
              <CardHeader className="py-2 bg-background/60 backdrop-blur-sm border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ActivitySquare className="h-4 w-4" />
                      TorLens
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Real-time Tor network monitoring and node data library for
                      Node.js
                    </CardDescription>
                  </div>
                  <Badge variant="outline">v0.0.1</Badge>
                </div>
              </CardHeader>
              <CardContent className="py-3 space-y-3">
                <div>
                  <div className="bg-muted rounded-lg p-2 border">
                    <pre className="text-xs overflow-x-auto">
                      <code>
                        {`// TypeScript example
import { TorLens, NodeData } from 'torlens';

async function getNodeInfo(identifier: string): Promise<NodeData> {
  const lens = new TorLens();
  return await lens.getRealtimeNodeInfo(identifier);
}

// Usage
getNodeInfo('192.168.1.1').then((node) => {
  console.log(\`Node Status: \${node.status}\`);
  console.log(\`Bandwidth: \${node.bandwidth} MB/s\`);
  console.log(\`Last Seen: \${node.lastSeen}\`);
});`}
                      </code>
                    </pre>
                  </div>
                </div>
                <div className="relative flex items-center bg-muted/50 p-2 rounded-lg border">
                  <div className="flex items-center">
                    <Terminal className="h-4 w-4 mr-2 opacity-70" />
                    <code className="text-sm font-mono">
                      {getInstallCommand()}
                    </code>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="ml-auto h-8 w-8 p-0"
                      >
                        {copied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Package className="h-4 w-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Package Managers</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setPackageManager("npm");
                          copyToClipboard("npm install torlens");
                        }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>npm</span>
                          <Copy className="h-3 w-3 opacity-70" />
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setPackageManager("yarn");
                          copyToClipboard("yarn add torlens");
                        }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>yarn</span>
                          <Copy className="h-3 w-3 opacity-70" />
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setPackageManager("pnpm");
                          copyToClipboard("pnpm add torlens");
                        }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>pnpm</span>
                          <Copy className="h-3 w-3 opacity-70" />
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setPackageManager("bun");
                          copyToClipboard("bun add torlens");
                        }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>bun</span>
                          <Copy className="h-3 w-3 opacity-70" />
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex gap-3">
                  <Button className="flex-1 rounded-lg" asChild>
                    <Link
                      href="https://github.com/0xpratikpatil/torlens"
                      target="_blank"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      <span>GitHub</span>
                    </Link>
                  </Button>
                  <Button className="flex-1 rounded-lg " asChild>
                    <Link href="https://www.npmjs.com/package/torlens" target="_blank">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Documentation</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
