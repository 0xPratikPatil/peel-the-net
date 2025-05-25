"use client"

import * as React from "react"
import { Search, Copy, Loader2, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { HeroHeader } from "@/components/header"
import { Separator } from "@/components/ui/separator"
import Footer from "@/components/footer"
import { GridBackground } from "@/components/grid-background"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

type RelayFlag = {
  name: string
  icon: React.ReactNode
  color: string
  tooltip: string
}

type RelayData = {
  nickname: string
  orAddresses: string[]
  contact: string
  dirAddress: string
  exitAddresses: string[]
  advertisedBandwidth: string
  ipv4ExitPolicy: string[]
  ipv6ExitPolicy: string[]
  exitPolicy: string
  effectiveFamilyMembers: string[]
  allegedFamilyMembers: string[]
  fingerprint: string
  uptime: string
  flags: RelayFlag[]
  additionalFlags: string[]
  hostName: string
  country: string
  countryCode: string
  asNumber: string
  asName: string
  firstSeen: string
  lastRestarted: string
  consensusWeight: number
  platform: string
}



interface RelaySearchProps {
  initialData?: RelayData | null;
  searchQuery?: string;
}

// Helper function to convert country code to flag emoji
const countryCodeToFlag = (countryCode: string): string => {
  if (!countryCode) return "";
  
  // Convert country code to uppercase
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  
  return String.fromCodePoint(...codePoints);
}

export default function RelaySearch({ initialData = null, searchQuery = "" }: RelaySearchProps) {
  const router = useRouter();
  const [searchInputValue, setSearchInputValue] = React.useState(decodeURIComponent(searchQuery))
  const [relay, setRelay] = React.useState<RelayData | null>(initialData)
  const [isLoading, setIsLoading] = React.useState(!initialData)
  const [showAllExitPolicy, setShowAllExitPolicy] = React.useState(false)
  const [showAllEffectiveFamily, setShowAllEffectiveFamily] = React.useState(false)

  React.useEffect(() => {
    if (initialData) {
      setRelay(initialData)
      setIsLoading(false)
    }
  }, [initialData])

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success("Copied to clipboard!")
      })
      .catch(err => console.error('Failed to copy:', err))
  }

  const handleSearch = () => {
    if (searchInputValue.trim()) {
      setIsLoading(true);
      router.push(`/relay/${(searchInputValue.trim())}`);
    }
  }

  // Helper function to truncate arrays
  const truncateArray = (arr: string[], limit: number) => {
    if (!arr || arr.length === 0) return ["None"];
    if (arr.length <= limit) return arr;
    return arr.slice(0, limit);
  }

  // Format the exit policy for display
  const formatExitPolicy = (policy: string) => {
    if (!policy) return "No exit policy";
    
    // If it's a simple rule, just return it
    if (policy.length < 40) return policy;
    
    // Otherwise format it
    return policy.split(", ").join("\n");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeroHeader />
      <GridBackground />
      <main className="flex-grow overflow-hidden relative z-10">
        <section className="container px-4 py-6 mx-auto">
          <div className="mx-auto max-w-screen-xl">
            {/* Header and Search */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0 mb-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-3xl font-bold">
                  <span className="text-white">Relay</span> Search
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  Search for Tor relays by fingerprint, nickname, or IP address
                </p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center space-x-2"
              >
                <Input 
                  value={searchInputValue}
                  onChange={(e) => setSearchInputValue(e.target.value)}
                  className="w-64 rounded-xl text-sm"
                  placeholder="Search by fingerprint or nickname..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="rounded-xl"
                  onClick={handleSearch}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </motion.div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin mb-4" />
                <p className="text-muted-foreground">Loading relay information...</p>
              </div>
            ) : relay ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Relay Status */}
                <div className="mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    Details for: {relay.nickname} 
                    <span className="ml-2 w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                    <span className="ml-2 text-sm text-muted-foreground">Online</span>
                  </h2>
                </div>

                <Separator className="my-4 border-dotted border-t border-muted" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Configuration */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <h3 className="text-lg font-semibold mb-3">Configuration</h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="font-medium text-muted-foreground mb-1 text-sm">Nickname</div>
                          <div className="text-base">{relay.nickname}</div>
                        </div>

                        <div>
                          <div className="font-medium text-muted-foreground mb-1 text-sm">OR Addresses</div>
                          <div className="p-1.5 border rounded-md bg-background/70 text-sm">
                            {relay.orAddresses.join(", ")}
                          </div>
                        </div>
                      </div>

                      <Separator className="border-dotted border-t border-muted" />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="font-medium text-muted-foreground mb-1 text-sm">Contact</div>
                          <div className="text-sm">{relay.contact}</div>
                        </div>

                        <div>
                          <div className="font-medium text-muted-foreground mb-1 text-sm">Host Name</div>
                          <div className="flex items-center">
                            <div className="truncate text-sm">{relay.hostName}</div>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="ml-1 h-6 w-6"
                              onClick={() => handleCopy(relay.hostName)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <Separator className="border-dotted border-t border-muted" />

                      <div>
                        <div className="font-medium text-muted-foreground mb-1 text-sm flex justify-between items-center">
                          <span>Exit Policy</span>
                          {relay.exitPolicy && relay.exitPolicy.length > 40 && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 px-2"
                              onClick={() => setShowAllExitPolicy(!showAllExitPolicy)}
                            >
                              {showAllExitPolicy ? (
                                <><ChevronUp className="h-3 w-3 mr-1" /> Show Less</>
                              ) : (
                                <><ChevronDown className="h-3 w-3 mr-1" /> Show More</>
                              )}
                            </Button>
                          )}
                        </div>
                        <div className="p-1.5 border rounded-md bg-background/70 font-mono text-xs max-h-48 overflow-y-auto">
                          <pre className="whitespace-pre-wrap">
                            {showAllExitPolicy 
                              ? formatExitPolicy(relay.exitPolicy)
                              : formatExitPolicy(relay.exitPolicy).split('\n').slice(0, 5).join('\n') + 
                                (relay.exitPolicy.split(', ').length > 5 ? '\n...' : '')}
                          </pre>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="font-medium text-muted-foreground mb-1 text-sm">IPv4 Exit Policy</div>
                          <div className="p-1.5 border rounded-md bg-background/70 font-mono text-xs">
                            {relay.ipv4ExitPolicy.map((line, i) => (
                              <div key={i}>{line}</div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="font-medium text-muted-foreground mb-1 text-sm">IPv6 Exit Policy</div>
                          <div className="p-1.5 border rounded-md bg-background/70 font-mono text-xs">
                            {relay.ipv6ExitPolicy.map((line, i) => (
                              <div key={i}>{line}</div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Separator className="border-dotted border-t border-muted" />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="font-medium text-muted-foreground mb-1 text-sm flex justify-between items-center">
                            <span>Effective Family</span>
                            {relay.effectiveFamilyMembers && relay.effectiveFamilyMembers.length > 5 && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 px-2"
                                onClick={() => setShowAllEffectiveFamily(!showAllEffectiveFamily)}
                              >
                                {showAllEffectiveFamily ? (
                                  <><ChevronUp className="h-3 w-3 mr-1" /> Show Less</>
                                ) : (
                                  <><ChevronDown className="h-3 w-3 mr-1" /> Show More</>
                                )}
                              </Button>
                            )}
                          </div>
                          <div className="p-1.5 border rounded-md bg-background/70 text-xs min-h-8 max-h-48 overflow-y-auto">
                            {relay.effectiveFamilyMembers.length > 0 
                              ? (showAllEffectiveFamily 
                                  ? relay.effectiveFamilyMembers 
                                  : truncateArray(relay.effectiveFamilyMembers, 5)
                                ).map((member, i) => (
                                  <div key={i} className="mb-1 font-mono">{member}</div>
                                ))
                              : "None"}
                            {!showAllEffectiveFamily && relay.effectiveFamilyMembers.length > 5 && (
                              <div className="text-muted-foreground mt-1">
                                ... and {relay.effectiveFamilyMembers.length - 5} more
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="font-medium text-muted-foreground mb-1 text-sm">Alleged Family</div>
                          <div className="p-1.5 border rounded-md bg-background/70 text-xs max-h-48 overflow-y-auto">
                            {relay.allegedFamilyMembers.join(", ")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Right Column - Properties */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h3 className="text-lg font-semibold mb-3">Properties</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="font-medium text-muted-foreground mb-1 text-sm">Fingerprint</div>
                        <div className="flex items-center">
                          <div className="p-1.5 border rounded-md bg-background/70 flex-grow font-mono text-xs">
                            {relay.fingerprint}
                          </div>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="ml-1"
                            onClick={() => handleCopy(relay.fingerprint)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="font-medium text-muted-foreground mb-1 text-sm">Country</div>
                          <div className="flex items-center">
                            <span className="mr-2 text-xl">
                              {countryCodeToFlag(relay.countryCode)}
                            </span>
                            <span className="text-sm">{relay.country}</span>
                          </div>
                        </div>

                        <div>
                          <div className="font-medium text-muted-foreground mb-1 text-sm">Advertised Bandwidth</div>
                          <div>{relay.advertisedBandwidth}</div>
                        </div>
                      </div>

                      <Separator className="border-dotted border-t border-muted" />

                      <div>
                        <div className="font-medium text-muted-foreground mb-1 text-sm">Flags</div>
                        <div className="flex flex-wrap gap-1.5">
                          {relay.flags.map((flag, i) => (
                            <Badge key={i} variant="outline" className="flex items-center space-x-1 py-1 px-2 text-sm">
                              <span>{flag.icon}</span>
                              <span>{flag.name}</span>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Separator className="border-dotted border-t border-muted" />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="font-medium text-muted-foreground mb-1 text-sm">AS Number</div>
                          <div className="flex items-center">
                            <span className="text-sm">{relay.asNumber}</span>
                          </div>
                        </div>

                        <div>
                          <div className="font-medium text-muted-foreground mb-1 text-sm">AS Name</div>
                          <div className="text-sm font-medium overflow-hidden text-ellipsis">
                            {relay.asName || "Unknown"}
                          </div>
                        </div>
                      </div>

                      <Separator className="border-dotted border-t border-muted" />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="font-medium text-muted-foreground mb-1 text-sm">First Seen</div>
                          <div className="text-sm">{relay.firstSeen.split(" (")[0]}</div>
                        </div>

                        <div>
                          <div className="font-medium text-muted-foreground mb-1 text-sm">Last Restarted</div>
                          <div className="text-sm">{relay.lastRestarted}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="font-medium text-muted-foreground mb-1 text-sm">Uptime</div>
                          <div className="text-sm">{relay.uptime}</div>
                        </div>

                        <div>
                          <div className="font-medium text-muted-foreground mb-1 text-sm">Platform</div>
                          <div className="text-sm">{relay.platform}</div>
                        </div>
                      </div>

                      <div>
                        <div className="font-medium text-muted-foreground mb-1 text-sm">Consensus Weight</div>
                        <div className="text-sm">{relay.consensusWeight}</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-10">
                <p>No relay found. Try searching with a different fingerprint or nickname.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}


