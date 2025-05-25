"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import RelaySearch from "@/components/relay-search";
import { Loader2 } from "lucide-react";

// Define types for relay data
interface RelayFlag {
  name: string;
  icon: string;
  color: string;
  tooltip: string;
}

interface RelayData {
  nickname: string;
  orAddresses: string[];
  contact: string;
  dirAddress: string;
  exitAddresses: string[];
  advertisedBandwidth: string;
  ipv4ExitPolicy: string[];
  ipv6ExitPolicy: string[];
  exitPolicy: string;
  effectiveFamilyMembers: string[];
  allegedFamilyMembers: string[];
  fingerprint: string;
  uptime: string;
  flags: RelayFlag[];
  additionalFlags: string[];
  hostName: string;
  country: string;
  countryCode: string;
  asNumber: string;
  asName: string;
  firstSeen: string;
  lastRestarted: string;
  consensusWeight: number;
  platform: string;
}

interface APIRelayResponse {
  relays?: {
    nickname?: string;
    or_addresses?: string[];
    contact?: string;
    dir_address?: string;
    exit_addresses?: string[];
    advertised_bandwidth?: number;
    exit_policy?: string[];
    exit_policy_summary?: {
      reject?: string[];
    };
    exit_policy_v6_summary?: {
      reject?: string[];
    };
    effective_family?: string[];
    alleged_family?: string[];
    fingerprint?: string;
    last_restarted?: string;
    flags?: string[];
    verified_host_names?: string[];
    country?: string;
    country_name?: string;
    as?: string;
    as_name?: string;
    first_seen?: string;
    consensus_weight?: number;
    platform?: string;
    running?: boolean;
  }[];
}

export default function RelayPage() {
  const params = useParams();
  const [relayData, setRelayData] = useState<RelayData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelayData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const searchParam = params.search as string;
        const response = await axios.get<APIRelayResponse>(`https://onionoo.torproject.org/details?search=${(searchParam)}`);
        
        // Check if we have relay data
        if (response.data && response.data.relays && response.data.relays.length > 0) {
          const relay = response.data.relays[0];
          
          // If relay isn't running, show error
          if (relay.running === false) {
            setError("This relay is not currently running.");
            setIsLoading(false);
            return;
          }
          
          // Transform the data to match the expected format in relay-search.tsx
          const transformedData: RelayData = {
            nickname: relay.nickname || "Unknown",
            orAddresses: relay.or_addresses || [],
            contact: relay.contact || "none",
            dirAddress: relay.dir_address || "none",
            exitAddresses: relay.exit_addresses || ["none"],
            advertisedBandwidth: `${Math.floor((relay.advertised_bandwidth || 0) / 1024)} KiB/s`,
            ipv4ExitPolicy: relay.exit_policy_summary?.reject || ["reject", "1-65535"],
            ipv6ExitPolicy: relay.exit_policy_v6_summary?.reject || relay.exit_policy_summary?.reject || ["reject", "1-65535"],
            // Join exit policy as a single string for display
            exitPolicy: relay.exit_policy ? relay.exit_policy.join(", ") : "reject *:*",
            // Ensure effective family is properly mapped
            effectiveFamilyMembers: relay.effective_family || [],
            allegedFamilyMembers: relay.alleged_family || ["none"],
            fingerprint: relay.fingerprint || "Unknown",
            uptime: calculateUptime(relay.last_restarted),
            flags: transformFlags(relay.flags),
            additionalFlags: [],
            hostName: relay.verified_host_names?.[0] || relay.or_addresses?.[0] || "unknown",
            country: relay.country_name || "Unknown",
            countryCode: relay.country?.toLowerCase() || "unknown",
            asNumber: relay.as || "AS0",
            asName: relay.as_name || "Unknown",
            firstSeen: formatDate(relay.first_seen),
            lastRestarted: formatDate(relay.last_restarted),
            consensusWeight: relay.consensus_weight || 0,
            platform: relay.platform || "Unknown",
          };
          
          setRelayData(transformedData);
        } else {
          setError("No relay found with the provided search parameter.");
        }
      } catch (err) {
        console.error("Failed to fetch relay data:", err);
        setError("Failed to fetch relay data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.search) {
      fetchRelayData();
    }
  }, [params.search]);

  // Helper function to calculate uptime from last_restarted timestamp
  const calculateUptime = (lastRestarted?: string): string => {
    if (!lastRestarted) return "Unknown";
    
    try {
      const restartDate = new Date(lastRestarted);
      const now = new Date();
      const diffMs = now.getTime() - restartDate.getTime();
      
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      return `${days} days ${hours} hours ${minutes} minutes and ${seconds} seconds`;
    } catch (e) {
      return "Unknown";
    }
  };

  // Helper function to format dates
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Unknown";
    
    try {
      const date = new Date(dateString);
      return date.toISOString().replace("T", " ").substring(0, 19);
    } catch (e) {
      return dateString;
    }
  };

  // Helper function to transform flags
  const transformFlags = (flags?: string[]): RelayFlag[] => {
    if (!flags || !Array.isArray(flags)) return [];
    
    const flagMappings: Record<string, RelayFlag> = {
      "Fast": { name: "Fast", icon: "⚡", color: "bg-yellow-500", tooltip: "This relay is fast" },
      "Guard": { name: "Guard", icon: "🛡️", color: "bg-blue-500", tooltip: "This relay can be used as a guard" },
      "HSDir": { name: "HSDir", icon: "📗", color: "bg-green-500", tooltip: "Hidden Service Directory" },
      "Running": { name: "Running", icon: "🔁", color: "bg-green-500", tooltip: "This relay is currently running" },
      "Stable": { name: "Stable", icon: "🔘", color: "bg-blue-500", tooltip: "This relay is stable" },
      "V2Dir": { name: "V2Dir", icon: "📘", color: "bg-blue-500", tooltip: "V2 Directory" },
      "Valid": { name: "Valid", icon: "✔️", color: "bg-green-500", tooltip: "This relay is valid" },
      "Exit": { name: "Exit", icon: "🚪", color: "bg-red-500", tooltip: "This relay can be used as an exit" },
    };
    
    return flags.map(flag => flagMappings[flag] || { 
      name: flag, 
      icon: "🔹", 
      color: "bg-gray-500", 
      tooltip: flag 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Loader2 className="h-12 w-12 animate-spin mb-4" />
          <p className="text-muted-foreground">Loading relay information...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-red-500 mb-2">{error}</p>
          <p className="text-muted-foreground">
            Try searching with a different fingerprint, nickname, or IP address.
          </p>
        </div>
      ) : (
        <RelaySearch initialData={relayData} searchQuery={params.search as string} />
      )}
    </div>
  );
}
