#!/usr/bin/env python3
import requests
import json
import csv
import os
import tempfile
import shutil
import ipaddress
from urllib.parse import urlparse
from datetime import datetime

# Create dataset directory if it doesn't exist
DATASET_DIR = "dataset"
os.makedirs(DATASET_DIR, exist_ok=True)

# Constants
ALL_NODES_CSV_FILENAME = os.path.join(DATASET_DIR, "all_nodes.csv")
GUARD_NODES_CSV_FILENAME = os.path.join(DATASET_DIR, "guard_nodes.csv")
EXIT_NODES_CSV_FILENAME = os.path.join(DATASET_DIR, "exit_nodes.csv")
ALL_NODES_JSON_FILENAME = os.path.join(DATASET_DIR, "all_nodes.json")
GUARD_NODES_JSON_FILENAME = os.path.join(DATASET_DIR, "guard_nodes.json")
EXIT_NODES_JSON_FILENAME = os.path.join(DATASET_DIR, "exit_nodes.json")
API_URL = "https://onionoo.torproject.org/details?search=type:relay%20running:true"
CSV_HEADER = ["fingerprint", "ipaddr", "port"]

def get_tor_nodes():
    """Fetch Tor node data from the Onionoo API"""
    try:
        response = requests.get(API_URL)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None

def parse_address(address):
    """Parse IP address and port from a string like '185.220.101.33:10033'"""
    try:
        # Handle IPv6 addresses which are enclosed in square brackets
        if '[' in address:
            # Format: [2a0b:f4c2:2::33]:10033
            parsed = urlparse(f"tcp://{address}")
            ip = ipaddress.ip_address(parsed.hostname.strip('[]'))
            port = parsed.port
        else:
            # Format: 185.220.101.33:10033
            ip, port = address.rsplit(':', 1)
            ip = ipaddress.ip_address(ip)
            port = int(port)
        
        return str(ip), port
    except Exception as e:
        print(f"Error parsing address {address}: {e}")
        return None, None

def process_node(node):
    """Process a single node and return its CSV rows"""
    rows = []
    fingerprint = node.get('fingerprint')
    or_addresses = node.get('or_addresses', [])
    
    for addr in or_addresses:
        ip, port = parse_address(addr)
        if ip and port:
            rows.append([fingerprint, ip, port])
    
    return rows

def write_csv_files(data):
    """Write node data to CSV files"""
    all_nodes_temp = tempfile.NamedTemporaryFile(delete=False, mode='w', newline='')
    guard_nodes_temp = tempfile.NamedTemporaryFile(delete=False, mode='w', newline='')
    exit_nodes_temp = tempfile.NamedTemporaryFile(delete=False, mode='w', newline='')
    
    try:
        all_writer = csv.writer(all_nodes_temp)
        guard_writer = csv.writer(guard_nodes_temp)
        exit_writer = csv.writer(exit_nodes_temp)
        
        # Write headers
        all_writer.writerow(CSV_HEADER)
        guard_writer.writerow(CSV_HEADER)
        exit_writer.writerow(CSV_HEADER)
        
        # Process each relay
        for relay in data.get('relays', []):
            rows = process_node(relay)
            
            for row in rows:
                all_writer.writerow(row)
                
                # Check if node has guard flag
                if 'Guard' in relay.get('flags', []) or any(flag.lower() == 'guard' for flag in relay.get('flags', [])):
                    guard_writer.writerow(row)
                
                # Check if node has exit flag
                if 'Exit' in relay.get('flags', []) or any(flag.lower() == 'exit' for flag in relay.get('flags', [])):
                    exit_writer.writerow(row)
        
        # Close the files
        all_nodes_temp.close()
        guard_nodes_temp.close()
        exit_nodes_temp.close()
        
        # Move temp files to final destination
        shutil.move(all_nodes_temp.name, ALL_NODES_CSV_FILENAME)
        shutil.move(guard_nodes_temp.name, GUARD_NODES_CSV_FILENAME)
        shutil.move(exit_nodes_temp.name, EXIT_NODES_CSV_FILENAME)
        
        print(f"CSV files created in {DATASET_DIR} directory")
    except Exception as e:
        print(f"Error writing CSV files: {e}")
        # Clean up temp files
        for f in [all_nodes_temp, guard_nodes_temp, exit_nodes_temp]:
            try:
                os.unlink(f.name)
            except:
                pass

def write_json_files(data):
    """Write node data to JSON files with sorting for guard and exit nodes"""
    try:
        # Add timestamp information to the data
        data["snapshot_timestamp"] = datetime.utcnow().isoformat()
        
        # All nodes - maintain original structure and all properties
        with open(ALL_NODES_JSON_FILENAME, 'w') as f:
            json.dump(data, f, indent=2)
        
        # Guard nodes - sorted by consensus_weight_fraction (if available)
        guard_nodes = [r for r in data.get("relays", []) if 'Guard' in r.get('flags', []) or
                      any(flag.lower() == 'guard' for flag in r.get('flags', []))]
        
        # Sort guard nodes by consensus_weight_fraction in descending order
        guard_nodes.sort(key=lambda x: x.get('consensus_weight_fraction', 0), reverse=True)
        
        guard_data = {
            "version": data.get("version"),
            "build_revision": data.get("build_revision"),
            "relays_published": data.get("relays_published"),
            "snapshot_timestamp": data.get("snapshot_timestamp"),
            "relays": guard_nodes,
            "bridges_published": data.get("bridges_published"),
            "bridges": data.get("bridges", [])
        }
        with open(GUARD_NODES_JSON_FILENAME, 'w') as f:
            json.dump(guard_data, f, indent=2)
        
        # Exit nodes - sorted by consensus_weight_fraction (if available)
        exit_nodes = [r for r in data.get("relays", []) if 'Exit' in r.get('flags', []) or
                     any(flag.lower() == 'exit' for flag in r.get('flags', []))]
        
        # Sort exit nodes by consensus_weight_fraction in descending order
        exit_nodes.sort(key=lambda x: x.get('consensus_weight_fraction', 0), reverse=True)
        
        exit_data = {
            "version": data.get("version"),
            "build_revision": data.get("build_revision"),
            "relays_published": data.get("relays_published"),
            "snapshot_timestamp": data.get("snapshot_timestamp"),
            "relays": exit_nodes,
            "bridges_published": data.get("bridges_published"),
            "bridges": data.get("bridges", [])
        }
        with open(EXIT_NODES_JSON_FILENAME, 'w') as f:
            json.dump(exit_data, f, indent=2)
        
        print(f"JSON files created in {DATASET_DIR} directory")
        print(f"- Sorted guard nodes by consensus weight: {len(guard_nodes)} nodes")
        print(f"- Sorted exit nodes by consensus weight: {len(exit_nodes)} nodes")
    except Exception as e:
        print(f"Error writing JSON files: {e}")

def main():
    """Main function to orchestrate the process"""
    # Fetch data
    print("Fetching Tor node data from Onionoo API...")
    data = get_tor_nodes()
    if not data:
        print("Failed to fetch data from API")
        return
    
    print(f"Successfully fetched data for {len(data.get('relays', []))} Tor relays")
    
    # Write to CSV files
    print("Creating CSV files...")
    write_csv_files(data)
    
    # Write to JSON files
    print("Creating JSON files...")
    write_json_files(data)
    
    print("Done! All files saved to the dataset directory.")

if __name__ == "__main__":
    main() 
