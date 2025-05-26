"use client";
import Link from "next/link";
import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/text-effect";
import { AnimatedGroup } from "@/components/animated-group";
import { HeroHeader } from "@/components/header";
import ServerSearch from "@/components/server-search";
import { motion } from "framer-motion";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <section className="container px-4 py-8 mx-auto">
          <div className="relative">
            <div className="mx-auto max-w-screen-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 lg:pr-6">
                  <TextEffect
                    preset="fade-in-blur"
                    speedSegment={0.3}
                    as="h1"
                    className="mt-4 text-4xl md:text-5xl font-medium tracking-tight"
                  >
                    Peel the Net
                  </TextEffect>
                  <TextEffect
                    preset="fade-in-blur"
                    speedSegment={0.3}
                    as="h2"
                    className="mt-2 text-3xl md:text-4xl font-medium text-muted-foreground"
                  >
                    Tor Network Explorer
                  </TextEffect>
                  <TextEffect
                    per="line"
                    preset="fade-in-blur"
                    speedSegment={0.3}
                    delay={0.5}
                    as="p"
                    className="mt-6 text-pretty text-base text-muted-foreground"
                  >
                    Explore and monitor the global network of Tor nodes with
                    real-time data. Get comprehensive insights on node status,
                    bandwidth, uptime, and more.
                  </TextEffect>

                  <AnimatedGroup
                    variants={{
                      container: {
                        visible: {
                          transition: {
                            staggerChildren: 0.05,
                            delayChildren: 0.75,
                          },
                        },
                      },
                      ...transitionVariants,
                    }}
                    className="mt-8 flex flex-wrap items-center gap-3"
                  >
                    <div
                      key={1}
                    >
                      <Button
                        asChild
                        size="lg"
                        className="rounded-xl"
                      >
                        <Link
                          href="https://github.com/0xpratikpatil/peel-the-net/dataset"
                          target="_blank"
                        >
                          <Database className="mr-2 h-5 w-5" />
                          <span className="text-nowrap">Access Dataset</span>
                        </Link>
                      </Button>
                    </div>
                  </AnimatedGroup>
                </div>

                <div className="lg:col-span-7 w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-background/50 backdrop-blur-sm rounded-xl border shadow-md p-4"
                  >
                    <ServerSearch />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
