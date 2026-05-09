import { useState } from "react";

const VENDORS = [
  {
    id: "cisco-asa",
    name: "Cisco ASA",
    color: "#00bceb",
    bg: "#001a2e",
    icon: "🔵",
    experience: "Used at Insight Global & Infosys — DMZ policy design, VPN, NAT/PAT, ACLs, FMC integration",
    sections: [
      {
        title: "Basic & Show Commands",
        commands: [
          { cmd: "show version", desc: "ASA software version, uptime, memory, flash" },
          { cmd: "show running-config", desc: "Full running configuration" },
          { cmd: "show interface ip brief", desc: "All interfaces with IP and status" },
          { cmd: "show conn count", desc: "Current connection count" },
          { cmd: "show conn detail", desc: "Detailed active connections" },
          { cmd: "show xlate", desc: "NAT translation table" },
          { cmd: "show nat", desc: "NAT policy rules" },
          { cmd: "show access-list", desc: "ACL hitcounts and rules" },
          { cmd: "show route", desc: "Routing table" },
          { cmd: "show crypto isakmp sa", desc: "IKE Phase 1 SA status" },
          { cmd: "show crypto ipsec sa", desc: "IKE Phase 2 / IPsec tunnel stats" },
          { cmd: "show vpn-sessiondb anyconnect", desc: "Active AnyConnect VPN sessions" },
          { cmd: "show failover", desc: "HA Active/Standby failover status" },
          { cmd: "show logging", desc: "Syslog buffer output" },
          { cmd: "show cpu usage", desc: "CPU utilization percentage" },
          { cmd: "show memory", desc: "Memory utilization" },
          { cmd: "show threat-detection statistics", desc: "Threat detection stats" },
        ]
      },
      {
        title: "Firewall Policy / ACL",
        commands: [
          { cmd: "access-list OUTSIDE_IN extended permit tcp any host 10.1.1.100 eq 443", desc: "Allow HTTPS from internet to server" },
          { cmd: "access-list OUTSIDE_IN extended deny ip any any log", desc: "Deny all with logging (implicit deny visible)" },
          { cmd: "access-group OUTSIDE_IN in interface outside", desc: "Apply ACL inbound on outside interface" },
          { cmd: "object network OBJ-SERVER\n  host 10.1.1.100", desc: "Create network object for server" },
          { cmd: "object-group network DMZ-SERVERS\n  network-object host 10.1.1.100\n  network-object host 10.1.1.101", desc: "Group multiple hosts" },
          { cmd: "clear access-list OUTSIDE_IN counters", desc: "Reset ACL hitcount statistics" },
          { cmd: "packet-tracer input outside tcp 1.2.3.4 1024 10.1.1.100 443", desc: "Simulate packet flow through ASA — your go-to troubleshooting command" },
        ]
      },
      {
        title: "NAT / PAT",
        commands: [
          { cmd: "object network OBJ-INSIDE\n  subnet 192.168.1.0 255.255.255.0\n  nat (inside,outside) dynamic interface", desc: "PAT — inside network to outside interface IP" },
          { cmd: "nat (inside,outside) static 192.168.1.10 203.0.113.10", desc: "Static NAT — one-to-one mapping" },
          { cmd: "nat (inside,outside) static tcp 192.168.1.10 80 203.0.113.10 80", desc: "Static PAT — port forwarding" },
          { cmd: "show xlate detail", desc: "Show all NAT translations with detail" },
          { cmd: "clear xlate", desc: "Clear NAT translation table (use with caution in prod)" },
        ]
      },
      {
        title: "Site-to-Site IPsec VPN",
        commands: [
          { cmd: "crypto isakmp policy 10\n  encryption aes-256\n  hash sha256\n  authentication pre-share\n  group 14\n  lifetime 86400", desc: "IKE Phase 1 policy (ISAKMP)" },
          { cmd: "crypto isakmp key MYKEY address 203.0.113.1", desc: "Pre-shared key for peer" },
          { cmd: "crypto ipsec transform-set TS esp-aes-256 esp-sha-256-hmac\n  mode tunnel", desc: "IKE Phase 2 transform set" },
          { cmd: "crypto map CMAP 10 match address VPN-ACL\ncrypto map CMAP 10 set peer 203.0.113.1\ncrypto map CMAP 10 set transform-set TS\ncrypto map CMAP interface outside", desc: "Crypto map binding — applied to outside interface" },
          { cmd: "show crypto isakmp sa", desc: "Check Phase 1 — should show MM_ACTIVE or QM_IDLE" },
          { cmd: "show crypto ipsec sa peer 203.0.113.1", desc: "Check Phase 2 encaps/decaps counters" },
          { cmd: "debug crypto isakmp 127", desc: "Debug Phase 1 negotiation (use in lab/maintenance only)" },
          { cmd: "debug crypto ipsec 127", desc: "Debug Phase 2 negotiation" },
          { cmd: "clear crypto isakmp sa", desc: "Reset IKE Phase 1 SA — forces re-negotiation" },
          { cmd: "clear crypto ipsec sa peer 203.0.113.1", desc: "Reset Phase 2 SA for specific peer" },
        ]
      },
      {
        title: "AnyConnect Remote Access VPN",
        commands: [
          { cmd: "webvpn\n  enable outside", desc: "Enable SSL/AnyConnect on outside interface" },
          { cmd: "show vpn-sessiondb anyconnect", desc: "List all active AnyConnect sessions" },
          { cmd: "show vpn-sessiondb detail anyconnect filter name sameer", desc: "Session details for specific user" },
          { cmd: "vpn-sessiondb logoff name sameer", desc: "Force disconnect a specific user session" },
          { cmd: "show ip local pool VPN-POOL", desc: "Check IP address pool usage" },
        ]
      },
      {
        title: "High Availability (Active/Standby)",
        commands: [
          { cmd: "show failover", desc: "Overall failover state — Active/Standby" },
          { cmd: "show failover interface", desc: "Failover link interface status" },
          { cmd: "show failover history", desc: "Log of previous failover events" },
          { cmd: "failover active", desc: "Force this unit to become Active" },
          { cmd: "no failover active", desc: "Force failover to standby (maintenance)" },
          { cmd: "write standby", desc: "Sync running config from Active to Standby" },
        ]
      },
      {
        title: "Packet Capture & Troubleshooting",
        commands: [
          { cmd: "capture CAP1 interface inside match tcp host 192.168.1.10 host 10.1.1.100", desc: "Capture traffic between two hosts on inside" },
          { cmd: "show capture CAP1", desc: "Display captured packets" },
          { cmd: "show capture CAP1 detail", desc: "Detailed packet dump" },
          { cmd: "copy /pcap capture:CAP1 tftp://192.168.1.200/cap1.pcap", desc: "Export capture to TFTP for Wireshark analysis" },
          { cmd: "no capture CAP1", desc: "Stop and delete capture" },
          { cmd: "ping inside 192.168.1.10", desc: "Ping from ASA's inside interface" },
          { cmd: "traceroute 8.8.8.8 source inside", desc: "Traceroute from inside interface" },
        ]
      },
    ]
  },
  {
    id: "cisco-ftd",
    name: "Cisco FTD / FMC",
    color: "#00bceb",
    bg: "#001a2e",
    icon: "🔷",
    experience: "Used at Insight Global & Infosys — FMC policy deployment, Firepower modules in ASA 5506/5508/5525, IPS signature updates",
    sections: [
      {
        title: "FTD CLI (CLISH) Commands",
        commands: [
          { cmd: "show version", desc: "FTD software and sensor version" },
          { cmd: "show interface ip brief", desc: "Interface status summary" },
          { cmd: "show conn count", desc: "Active connection count" },
          { cmd: "show route", desc: "Routing table" },
          { cmd: "show access-control-config", desc: "Access control policy name applied" },
          { cmd: "show snort statistics", desc: "Snort engine packet processing stats" },
          { cmd: "show snort counters", desc: "Snort drop/pass counters" },
          { cmd: "show nat", desc: "NAT policy translations" },
          { cmd: "show crypto isakmp sa", desc: "Phase 1 VPN SA status" },
          { cmd: "show crypto ipsec sa", desc: "Phase 2 VPN SA with encaps/decaps" },
          { cmd: "show managers", desc: "FMC registration and connection status" },
        ]
      },
      {
        title: "FTD Expert Mode (Linux Shell)",
        commands: [
          { cmd: "expert", desc: "Drop to Linux bash shell from CLISH" },
          { cmd: "sudo sf_troubleshoot.pl", desc: "Generate troubleshooting bundle" },
          { cmd: "pmtool status", desc: "Check all FTD process/daemon status" },
          { cmd: "tail -f /var/log/messages", desc: "Live system log monitoring" },
          { cmd: "pigtail -I snort", desc: "Live Snort inspection logs" },
          { cmd: "cat /ngfw/var/log/action_queue.log", desc: "Policy deployment action log" },
        ]
      },
      {
        title: "FMC Web UI — Key Workflows",
        commands: [
          { cmd: "Policies → Access Control → Edit Policy → Add Rule", desc: "Create new firewall rule — set zones, networks, ports, action (Allow/Block/Trust)" },
          { cmd: "Policies → NAT → Add Rule", desc: "Configure static/dynamic NAT — Auto NAT or Manual NAT" },
          { cmd: "Policies → Intrusion → Create Policy", desc: "Apply IPS policy — Balanced Security/Connectivity recommended baseline" },
          { cmd: "Devices → Device Management → Deploy", desc: "Push policy changes from FMC to FTD — ALWAYS verify before deploying" },
          { cmd: "Analysis → Connections → Events", desc: "View connection events — filter by IP, port, action, initiator" },
          { cmd: "Analysis → Intrusions → Events", desc: "IPS/IDS alert events with signature detail" },
          { cmd: "System → Updates → Intrusion Rules", desc: "Update Snort/IPS signatures from Cisco Talos" },
          { cmd: "Health → Monitor", desc: "Check CPU, memory, disk, interface health on all managed devices" },
        ]
      },
      {
        title: "FTD Packet Tracer & Capture",
        commands: [
          { cmd: "packet-tracer input inside tcp 192.168.1.10 1024 8.8.8.8 443 detail", desc: "Trace packet through all policy phases — ACL, NAT, IPS, routing" },
          { cmd: "capture CAP1 interface inside match tcp host 192.168.1.10 any", desc: "Capture packets on inside interface" },
          { cmd: "show capture CAP1 decode", desc: "Decode captured packets inline" },
          { cmd: "show capture CAP1 pcap url tftp://192.168.1.200/", desc: "Export to TFTP for Wireshark" },
        ]
      },
    ]
  },
  {
    id: "fortigate",
    name: "FortiGate",
    color: "#ee3124",
    bg: "#1a0000",
    icon: "🔴",
    experience: "Used at Insight Global & Infosys — DMZ/internal firewall policy, IPsec VPN, SSL VPN FortiClient, rule optimization",
    sections: [
      {
        title: "Basic Show Commands",
        commands: [
          { cmd: "get system status", desc: "FortiOS version, serial, hostname, uptime" },
          { cmd: "get system interface physical", desc: "Physical interface stats — speed, duplex, traffic" },
          { cmd: "get system arp", desc: "ARP table" },
          { cmd: "get router info routing-table all", desc: "Full routing table" },
          { cmd: "get router info bgp summary", desc: "BGP neighbor summary" },
          { cmd: "diagnose sys session list", desc: "Active session table" },
          { cmd: "diagnose sys session stat", desc: "Session statistics — count, TCP/UDP breakdown" },
          { cmd: "get vpn ipsec tunnel summary", desc: "IPsec tunnel status — up/down" },
          { cmd: "diagnose vpn tunnel list", desc: "Detailed IPsec tunnel info — selectors, bytes" },
          { cmd: "get vpn ssl monitor", desc: "Active SSL VPN / FortiClient sessions" },
          { cmd: "get firewall policy", desc: "List all firewall policies (brief)" },
          { cmd: "show firewall policy 10", desc: "Detail of policy ID 10" },
        ]
      },
      {
        title: "Firewall Policy (CLI)",
        commands: [
          { cmd: "config firewall policy\n  edit 0\n    set name \"Allow-HTTPS-DMZ\"\n    set srcintf \"inside\"\n    set dstintf \"dmz\"\n    set srcaddr \"all\"\n    set dstaddr \"DMZ-Web-Server\"\n    set action accept\n    set schedule \"always\"\n    set service \"HTTPS\"\n    set logtraffic all\n  next\nend", desc: "Create new firewall policy — allow HTTPS to DMZ server" },
          { cmd: "config firewall policy\n  edit 10\n    set status disable\n  next\nend", desc: "Disable a policy without deleting it" },
          { cmd: "diagnose firewall iprope lookup 10.0.0.1 8.8.8.8 6 1024 443", desc: "Policy lookup — which rule matches this traffic (like packet-tracer)" },
        ]
      },
      {
        title: "NAT Configuration",
        commands: [
          { cmd: "config firewall policy\n  edit 10\n    set nat enable\n  next\nend", desc: "Enable outbound NAT (PAT using egress interface IP) on policy" },
          { cmd: "config firewall vip\n  edit \"VIP-WebServer\"\n    set extip 203.0.113.10\n    set mappedip 192.168.1.100\n    set extintf \"wan1\"\n    set portforward enable\n    set extport 443\n    set mappedport 443\n  next\nend", desc: "Virtual IP (DNAT) — port forward 443 from WAN to internal server" },
          { cmd: "config firewall ippool\n  edit \"OUTBOUND-POOL\"\n    set startip 203.0.113.20\n    set endip 203.0.113.30\n    set type overload\n  next\nend", desc: "IP pool for PAT with a range of public IPs" },
        ]
      },
      {
        title: "IPsec Site-to-Site VPN",
        commands: [
          { cmd: "config vpn ipsec phase1-interface\n  edit \"VPN-TO-BRANCH\"\n    set interface \"wan1\"\n    set remote-gw 203.0.113.1\n    set psksecret MYKEY\n    set ike-version 2\n    set proposal aes256-sha256\n    set dhgrp 14\n  next\nend", desc: "Phase 1 IKEv2 tunnel configuration" },
          { cmd: "config vpn ipsec phase2-interface\n  edit \"VPN-TO-BRANCH-P2\"\n    set phase1name \"VPN-TO-BRANCH\"\n    set proposal aes256-sha256\n    set src-subnet 10.0.1.0/24\n    set dst-subnet 10.0.2.0/24\n  next\nend", desc: "Phase 2 — define interesting traffic selectors" },
          { cmd: "get vpn ipsec tunnel summary", desc: "Quick check — tunnel up or down" },
          { cmd: "diagnose vpn ike log-filter dst-addr4 203.0.113.1", desc: "Filter IKE debug to specific peer" },
          { cmd: "diagnose debug application ike -1", desc: "Enable IKE debug logs" },
          { cmd: "diagnose debug enable", desc: "Start debug output" },
          { cmd: "diagnose debug disable", desc: "Stop debug output" },
          { cmd: "diagnose vpn tunnel up VPN-TO-BRANCH", desc: "Force bring up an IPsec tunnel" },
          { cmd: "diagnose vpn tunnel reset VPN-TO-BRANCH", desc: "Reset/restart a specific tunnel" },
        ]
      },
      {
        title: "SSL VPN (FortiClient)",
        commands: [
          { cmd: "config vpn ssl settings\n  set servercert \"self-sign\"\n  set tunnel-ip-pools \"SSLVPN-POOL\"\n  set port 443\n  set status enable\nend", desc: "Enable SSL VPN on port 443" },
          { cmd: "config vpn ssl web portal\n  edit \"full-access\"\n    set tunnel-mode enable\n    set ip-pools \"SSLVPN-POOL\"\n    set split-tunneling disable\n  next\nend", desc: "SSL VPN portal — full tunnel mode" },
          { cmd: "get vpn ssl monitor", desc: "View all connected SSL VPN users" },
          { cmd: "diagnose vpn ssl list", desc: "Detailed SSL VPN session info" },
        ]
      },
      {
        title: "Packet Sniffer & Debug Flow",
        commands: [
          { cmd: "diagnose sniffer packet any 'host 192.168.1.10' 4 100", desc: "Sniff packets — any interface, filter by host, verbosity 4, 100 packets" },
          { cmd: "diagnose sniffer packet wan1 'tcp port 443' 6", desc: "Capture HTTPS on WAN with full hex dump (verbosity 6)" },
          { cmd: "diagnose debug flow filter addr 192.168.1.10", desc: "Debug flow filter for specific IP" },
          { cmd: "diagnose debug flow filter proto 6", desc: "Filter debug to TCP only" },
          { cmd: "diagnose debug flow show function-name enable", desc: "Show function names in flow debug" },
          { cmd: "diagnose debug flow trace start 100", desc: "Start flow trace — 100 packets" },
          { cmd: "diagnose debug enable", desc: "Enable debug output to terminal" },
          { cmd: "diagnose debug disable", desc: "Stop debug output" },
          { cmd: "diagnose debug reset", desc: "Clear all debug filters and settings" },
        ]
      },
      {
        title: "High Availability (FGCP)",
        commands: [
          { cmd: "get system ha status", desc: "HA cluster status — master/slave, sync state" },
          { cmd: "diagnose sys ha status", desc: "Detailed HA diagnostic" },
          { cmd: "diagnose sys ha checksum cluster", desc: "Verify config sync between HA peers" },
          { cmd: "execute ha manage 0 admin", desc: "Connect to secondary HA unit CLI" },
          { cmd: "diagnose sys ha reset-uptime", desc: "Force re-election of master unit" },
        ]
      },
    ]
  },
  {
    id: "paloalto",
    name: "Palo Alto",
    color: "#fa582d",
    bg: "#1a0800",
    icon: "🟠",
    experience: "Exposure via Infosys — firewall policy, NAT, log analysis, basic admin. Listed in key skills.",
    sections: [
      {
        title: "Basic CLI Commands",
        commands: [
          { cmd: "show system info", desc: "Hostname, serial, OS version, uptime, model" },
          { cmd: "show interface all", desc: "All interface status, IPs, zones" },
          { cmd: "show routing route", desc: "Routing table" },
          { cmd: "show session all", desc: "All active sessions" },
          { cmd: "show session id <ID>", desc: "Detail on a specific session" },
          { cmd: "show session info", desc: "Session table stats — total, active, tcp, udp" },
          { cmd: "show arp all", desc: "ARP table across all interfaces" },
          { cmd: "show counter global", desc: "Global packet counters — drops, errors" },
          { cmd: "show jobs all", desc: "Status of all background jobs — commits, installs" },
          { cmd: "show running security-policy", desc: "Active security policies in memory" },
          { cmd: "show running nat-policy", desc: "Active NAT rules in memory" },
        ]
      },
      {
        title: "Security Policy",
        commands: [
          { cmd: "set rulebase security rules Allow-Web from trust to untrust source any destination any application web-browsing service application-default action allow", desc: "Allow web-browsing from trust to untrust" },
          { cmd: "test security-policy-match source 192.168.1.10 destination 8.8.8.8 protocol 6 destination-port 443 from trust to untrust", desc: "Test which security rule matches — equivalent to packet-tracer" },
          { cmd: "show running security-policy | match <rule-name>", desc: "Find a specific rule in running policy" },
        ]
      },
      {
        title: "NAT Policy",
        commands: [
          { cmd: "set rulebase nat rules SNAT-OUT from trust to untrust source 192.168.0.0/16 destination any service any translated-address 203.0.113.5 translated-port none", desc: "Source NAT — masquerade inside to public IP" },
          { cmd: "set rulebase nat rules DNAT-WEB from untrust to untrust destination 203.0.113.5 service tcp/443 translated-destination 192.168.1.100 translated-port 443", desc: "Destination NAT — port forward 443 to web server" },
          { cmd: "test nat-policy-match source 192.168.1.10 destination 8.8.8.8 protocol 6 destination-port 443 from trust to untrust", desc: "Test which NAT rule applies" },
        ]
      },
      {
        title: "VPN (IPsec Tunnel)",
        commands: [
          { cmd: "show vpn ike-sa", desc: "IKE Phase 1 SA — state, peer, gateway" },
          { cmd: "show vpn ipsec-sa", desc: "IPsec Phase 2 SA — tunnel details, bytes" },
          { cmd: "show vpn flow", desc: "VPN traffic flow statistics" },
          { cmd: "test vpn ike-sa gateway <gw-name>", desc: "Initiate IKE SA — trigger Phase 1" },
          { cmd: "test vpn ipsec-sa tunnel <tunnel-name>", desc: "Trigger Phase 2 SA negotiation" },
          { cmd: "debug ike pcap on", desc: "Capture IKE negotiation packets" },
          { cmd: "clear vpn ike-sa gateway <gw-name>", desc: "Clear Phase 1 SA — force re-negotiation" },
        ]
      },
      {
        title: "Packet Capture & Test Tools",
        commands: [
          { cmd: "debug dataplane packet-diag clear", desc: "Clear previous packet debug session" },
          { cmd: "debug dataplane packet-diag set filter match source 192.168.1.10 destination 8.8.8.8", desc: "Set packet capture filter" },
          { cmd: "debug dataplane packet-diag set capture stage firewall action allow", desc: "Capture only allowed traffic at firewall stage" },
          { cmd: "debug dataplane packet-diag show setting", desc: "Confirm capture settings" },
          { cmd: "debug dataplane packet-diag start", desc: "Start packet debug capture" },
          { cmd: "debug dataplane packet-diag dump", desc: "Show captured packets" },
          { cmd: "tftp export mgmt-pcap from <filename> to <tftp-ip>", desc: "Export pcap to TFTP server" },
        ]
      },
      {
        title: "Commit & Operations",
        commands: [
          { cmd: "commit", desc: "Commit candidate config to running config" },
          { cmd: "commit confirmed 10", desc: "Commit with 10-minute auto-rollback if not confirmed" },
          { cmd: "show jobs id <N>", desc: "Monitor commit job status" },
          { cmd: "request system software check", desc: "Check available PAN-OS updates" },
          { cmd: "request restart system", desc: "Reboot the firewall" },
          { cmd: "save config to <filename>", desc: "Save named config snapshot" },
          { cmd: "load config from <filename>", desc: "Load a saved config snapshot" },
        ]
      },
    ]
  },
  {
    id: "juniper-srx",
    name: "Juniper SRX",
    color: "#84b135",
    bg: "#0d1a00",
    icon: "🟢",
    experience: "Juniper wireless APs managed at Insight Global via centralized Juniper Mist cloud — SSID, RF optimization, firmware. SRX commands for interview readiness.",
    sections: [
      {
        title: "Basic Show Commands",
        commands: [
          { cmd: "show version", desc: "JunOS version, hostname, hardware" },
          { cmd: "show interfaces terse", desc: "All interfaces — IP, status (brief)" },
          { cmd: "show interfaces ge-0/0/0 detail", desc: "Detailed stats on a specific interface" },
          { cmd: "show route", desc: "Full routing table" },
          { cmd: "show route 8.8.8.8", desc: "Best route for specific destination" },
          { cmd: "show arp", desc: "ARP table" },
          { cmd: "show chassis hardware", desc: "Hardware inventory" },
          { cmd: "show chassis alarms", desc: "Hardware/software alarms" },
          { cmd: "show security zones", desc: "All security zones and interfaces" },
          { cmd: "show security policies", desc: "All security policies" },
          { cmd: "show security flow session", desc: "Active session table" },
          { cmd: "show security flow session summary", desc: "Session count summary" },
        ]
      },
      {
        title: "Firewall Policy (Zones-based)",
        commands: [
          { cmd: "show security zones", desc: "List zones and their interface assignments" },
          { cmd: "set security zones security-zone trust interfaces ge-0/0/1.0", desc: "Assign interface to trust zone" },
          { cmd: "set security policies from-zone trust to-zone untrust policy Allow-Web match source-address any destination-address any application junos-https", desc: "Allow HTTPS from trust to untrust" },
          { cmd: "set security policies from-zone trust to-zone untrust policy Allow-Web then permit", desc: "Set action to permit" },
          { cmd: "show security policies from-zone trust to-zone untrust", desc: "Show policies between two zones" },
          { cmd: "show security policies hit-count", desc: "Policy hit counts — find unused rules" },
        ]
      },
      {
        title: "NAT",
        commands: [
          { cmd: "set security nat source rule-set SNAT-OUT from zone trust\nset security nat source rule-set SNAT-OUT to zone untrust\nset security nat source rule-set SNAT-OUT rule R1 match source-address 192.168.0.0/16\nset security nat source rule-set SNAT-OUT rule R1 then source-nat interface", desc: "Source NAT — PAT using egress interface" },
          { cmd: "set security nat destination rule-set DNAT-IN from zone untrust\nset security nat destination rule-set DNAT-IN rule R1 match destination-address 203.0.113.10/32\nset security nat destination rule-set DNAT-IN rule R1 then destination-nat pool WEB-POOL", desc: "Destination NAT — inbound port forwarding" },
          { cmd: "show security nat source rule all", desc: "Show all source NAT rules and hit counts" },
          { cmd: "show security nat destination rule all", desc: "Show all destination NAT rules" },
          { cmd: "show security nat translations", desc: "Active NAT translation table" },
        ]
      },
      {
        title: "IPsec VPN",
        commands: [
          { cmd: "set security ike proposal IKE-P1 authentication-method pre-shared-keys\nset security ike proposal IKE-P1 dh-group group14\nset security ike proposal IKE-P1 encryption-algorithm aes-256-cbc\nset security ike proposal IKE-P1 authentication-algorithm sha-256", desc: "IKE Phase 1 proposal" },
          { cmd: "set security ike policy IKE-POL mode main\nset security ike policy IKE-POL proposals IKE-P1\nset security ike policy IKE-POL pre-shared-key ascii-text MYKEY", desc: "IKE policy with PSK" },
          { cmd: "set security ike gateway GW-BRANCH ike-policy IKE-POL\nset security ike gateway GW-BRANCH address 203.0.113.1\nset security ike gateway GW-BRANCH external-interface ge-0/0/0.0", desc: "IKE gateway pointing to remote peer" },
          { cmd: "show security ike security-associations", desc: "IKE Phase 1 SA — state, peer" },
          { cmd: "show security ipsec security-associations", desc: "IPsec Phase 2 SA — SPI, bytes in/out" },
          { cmd: "clear security ike security-associations all", desc: "Clear all Phase 1 SAs — forces re-negotiation" },
          { cmd: "clear security ipsec security-associations all", desc: "Clear all Phase 2 SAs" },
        ]
      },
      {
        title: "Packet Capture & Debug",
        commands: [
          { cmd: "monitor traffic interface ge-0/0/1 matching \"host 192.168.1.10\"", desc: "Live packet capture on interface — like tcpdump" },
          { cmd: "monitor traffic interface ge-0/0/0 count 100 write-file /var/tmp/cap.pcap", desc: "Capture 100 packets and save to file" },
          { cmd: "file copy /var/tmp/cap.pcap ftp://admin@192.168.1.200/", desc: "Export pcap to FTP server" },
          { cmd: "show security flow session destination-prefix 8.8.8.8", desc: "Show sessions for a specific destination" },
          { cmd: "set security flow traceoptions file FLOW-TRACE\nset security flow traceoptions flag all", desc: "Enable flow debug tracing" },
          { cmd: "show log FLOW-TRACE", desc: "View flow trace log output" },
        ]
      },
      {
        title: "Juniper Mist (Wireless APs — Insight Global)",
        commands: [
          { cmd: "Mist Dashboard → Access Points → [Select AP] → Utilities → Test Tools", desc: "Run ping, traceroute, packet capture from AP directly in cloud portal" },
          { cmd: "Mist → Sites → Radio Management → RF Templates", desc: "Configure RF optimization — channel, power, band steering, RRM" },
          { cmd: "Mist → WLANs → Create WLAN → Set SSID, Security (WPA2-Enterprise/PSK), VLAN", desc: "Create new SSID — your primary task at Insight Global" },
          { cmd: "Mist → Devices → Firmware → Schedule Upgrade", desc: "Schedule AP firmware upgrades during maintenance windows" },
          { cmd: "show ap list", desc: "List all APs and their status (Mist CLI)" },
          { cmd: "show ap detail <AP-MAC>", desc: "AP hardware, firmware, and radio detail" },
        ]
      },
    ]
  },
  {
    id: "illumio",
    name: "Illumio Core",
    color: "#6c63ff",
    bg: "#0a0014",
    icon: "🟣",
    experience: "Primary tool at Insight Global — deployed Zero Trust micro-segmentation across data centers, DCs, stores. Managed VEN agents, labels, rulesets, enforcement modes.",
    sections: [
      {
        title: "Core Concepts (Interview Gold)",
        commands: [
          { cmd: "PCE (Policy Compute Engine)", desc: "Central brain of Illumio — stores policy, labels, workloads, and computes rules. Can be SaaS or on-prem." },
          { cmd: "VEN (Virtual Enforcement Node)", desc: "Agent installed on each workload (Windows/Linux server). Enforces policy locally using iptables/WFP. Reports flows to PCE." },
          { cmd: "Labels", desc: "4-dimension tagging system: Role (App/DB/Web), App (Ecommerce/HR), Env (Prod/Dev/QA), Loc (DC1/Store/Cloud). Policy is written against labels — not IPs." },
          { cmd: "Rulesets", desc: "Collection of rules scoped to specific label combinations. Rules define which workloads can talk to which, on which ports/protocols." },
          { cmd: "Enforcement Modes", desc: "Visibility Only → Selective → Full. You progressed workloads through these stages. In Visibility, policy is logged but not enforced. In Full, policy is actively enforced." },
          { cmd: "Application Dependency Map", desc: "Visual traffic map generated from VEN telemetry — shows all flows between workloads. You used this for risky path identification." },
          { cmd: "Illumination (Explorer)", desc: "Query tool to search flow logs — filter by IP, port, label, process, allowed/blocked. Equivalent to log analysis." },
        ]
      },
      {
        title: "PCE CLI Commands",
        commands: [
          { cmd: "illumio-pce-env status", desc: "Check PCE service health — all components running" },
          { cmd: "illumio-pce-env start", desc: "Start PCE services" },
          { cmd: "illumio-pce-env stop", desc: "Stop PCE services" },
          { cmd: "illumio-pce-ctl health-check", desc: "Run full PCE health check" },
          { cmd: "illumio-pce-ctl workloads --online", desc: "List all online workloads (VEN connected)" },
          { cmd: "illumio-pce-ctl workloads --offline", desc: "List offline/disconnected workloads" },
          { cmd: "illumio-pce-ctl provision --all", desc: "Provision (activate) all pending policy changes" },
        ]
      },
      {
        title: "VEN Agent Commands (on Workload)",
        commands: [
          { cmd: "illumio-ven-ctl activate --management-server pce.company.com --activation-code <CODE>", desc: "Pair VEN to PCE — your primary onboarding task" },
          { cmd: "illumio-ven-ctl status", desc: "VEN agent status — running, enforcement mode, PCE connectivity" },
          { cmd: "illumio-ven-ctl health", desc: "VEN health check — iptables sync, policy age, connection state" },
          { cmd: "illumio-ven-ctl unpair --mode saved-policy", desc: "Unpair VEN but keep iptables rules (safe for maintenance)" },
          { cmd: "illumio-ven-ctl unpair --mode remove-policy", desc: "Unpair and remove all Illumio firewall rules" },
          { cmd: "illumio-ven-ctl workload-interfaces", desc: "List interfaces VEN is monitoring" },
          { cmd: "systemctl status illumio-ven", desc: "VEN systemd service status (Linux)" },
          { cmd: "Get-Service illumio-ven", desc: "VEN service status (Windows PowerShell)" },
        ]
      },
      {
        title: "Your Day-to-Day Workflow",
        commands: [
          { cmd: "Step 1: Onboard workload → Install VEN → Pair to PCE → Assign labels (Role/App/Env/Loc)", desc: "Every new server starts here" },
          { cmd: "Step 2: Monitor in Visibility mode → Use Illumination/Explorer to map traffic flows", desc: "Understand what talks to what before enforcing" },
          { cmd: "Step 3: Build rulesets → Write rules based on observed flows → Scope to correct label sets", desc: "Create allow rules for legitimate traffic" },
          { cmd: "Step 4: Move to Selective enforcement → Test critical app paths → Escalate issues to app owners", desc: "Partial enforcement — only policy-matched traffic enforced" },
          { cmd: "Step 5: Full enforcement → All traffic not in ruleset is blocked → Lateral movement restricted", desc: "Zero Trust achieved — blast radius minimized" },
          { cmd: "Step 6: Ongoing — review Explorer for blocked flows, refine rules, handle VEN incidents", desc: "Continuous improvement loop — your change management runbook" },
        ]
      },
    ]
  },
  {
    id: "saltstack",
    name: "Salt Stack",
    color: "#57a0d3",
    bg: "#00101a",
    icon: "🔘",
    experience: "Used at Insight Global — pushed standardized firewall configs from Salt Master to ASA/FortiGate Salt Minions. Automation and consistency across fleet.",
    sections: [
      {
        title: "Core Concepts",
        commands: [
          { cmd: "Salt Master", desc: "Central management server — you ran commands from here to manage all firewall minions" },
          { cmd: "Salt Minion", desc: "Agent installed on each managed device (firewall) — receives and executes commands from master" },
          { cmd: "Grains", desc: "Static metadata about a minion — OS, hostname, IP, custom tags. Used for targeting." },
          { cmd: "Pillar", desc: "Secure, per-minion configuration data stored on master — passwords, device-specific vars" },
          { cmd: "State files (.sls)", desc: "YAML-based desired state definitions — describe what config should look like on a device" },
        ]
      },
      {
        title: "Salt CLI Commands (from Master)",
        commands: [
          { cmd: "salt '*' test.ping", desc: "Ping all minions — check connectivity to entire fleet" },
          { cmd: "salt 'fw-asa-01' test.ping", desc: "Ping specific firewall minion" },
          { cmd: "salt -G 'os:cisco' test.ping", desc: "Target by grain — all Cisco devices" },
          { cmd: "salt '*' grains.items", desc: "Get all grains from all minions" },
          { cmd: "salt 'fw-asa-01' grains.get os", desc: "Get specific grain from a minion" },
          { cmd: "salt '*' state.apply firewall_baseline", desc: "Apply state file to all minions — push standard config" },
          { cmd: "salt 'fw-asa-01' state.apply asa_acl_update", desc: "Apply specific state to one firewall" },
          { cmd: "salt '*' state.apply test=True", desc: "Dry run — see what WOULD change without applying" },
          { cmd: "salt 'fw-*' cmd.run 'show version'", desc: "Run arbitrary CLI command on all firewalls matching pattern" },
          { cmd: "salt-run manage.status", desc: "Check which minions are up/down from master" },
          { cmd: "salt-key -L", desc: "List all minion keys — pending/accepted/rejected" },
          { cmd: "salt-key -A", desc: "Accept all pending minion keys" },
          { cmd: "salt-key -d fw-old-01", desc: "Delete/revoke a minion key" },
        ]
      },
    ]
  },
  {
    id: "cisco-routing",
    name: "Cisco Routing & Switching",
    color: "#00bceb",
    bg: "#001a2e",
    icon: "🔵",
    experience: "Core role at Capgemini — managed routers/switches across branch and DC. OSPF, EIGRP, BGP, VLANs, STP, HSRP, EtherChannel.",
    sections: [
      {
        title: "OSPF Commands",
        commands: [
          { cmd: "show ip ospf neighbor", desc: "OSPF neighbor adjacencies — state should be FULL" },
          { cmd: "show ip ospf database", desc: "OSPF LSDB — all LSA types" },
          { cmd: "show ip ospf database router", desc: "Router LSAs (Type 1)" },
          { cmd: "show ip route ospf", desc: "Routes learned via OSPF" },
          { cmd: "show ip ospf interface brief", desc: "OSPF-enabled interfaces — area, cost, state" },
          { cmd: "router ospf 1\n  network 10.0.0.0 0.0.0.255 area 0\n  passive-interface Gi0/1", desc: "Basic OSPF config — advertise 10.0.0.0/24, make Gi0/1 passive" },
          { cmd: "debug ip ospf events", desc: "Debug OSPF neighbor events" },
          { cmd: "debug ip ospf adj", desc: "Debug OSPF adjacency formation" },
          { cmd: "clear ip ospf process", desc: "Reset OSPF process — forces re-adjacency (use carefully)" },
        ]
      },
      {
        title: "EIGRP Commands",
        commands: [
          { cmd: "show ip eigrp neighbors", desc: "EIGRP neighbor table — uptime, queue, retransmit" },
          { cmd: "show ip eigrp topology", desc: "EIGRP topology table — successors and feasible successors" },
          { cmd: "show ip eigrp topology all-links", desc: "Full topology including non-successor routes" },
          { cmd: "show ip route eigrp", desc: "Routes learned via EIGRP" },
          { cmd: "router eigrp 100\n  network 10.0.0.0\n  no auto-summary", desc: "Basic EIGRP config — AS 100, disable auto-summary" },
          { cmd: "debug ip eigrp", desc: "Debug EIGRP route updates" },
          { cmd: "clear ip eigrp neighbors", desc: "Reset all EIGRP neighbors" },
        ]
      },
      {
        title: "BGP Commands",
        commands: [
          { cmd: "show ip bgp summary", desc: "BGP neighbor summary — state, prefixes received" },
          { cmd: "show ip bgp", desc: "Full BGP table" },
          { cmd: "show ip bgp neighbor 10.0.0.1 routes", desc: "Routes received from specific BGP peer" },
          { cmd: "show ip bgp neighbor 10.0.0.1 advertised-routes", desc: "Routes advertised to specific peer" },
          { cmd: "router bgp 65001\n  neighbor 10.0.0.1 remote-as 65002\n  network 203.0.113.0 mask 255.255.255.0", desc: "Basic eBGP config — peer with AS 65002, advertise prefix" },
          { cmd: "clear ip bgp * soft", desc: "Soft reset BGP — re-apply policy without dropping sessions" },
          { cmd: "clear ip bgp 10.0.0.1", desc: "Hard reset BGP session with specific peer" },
          { cmd: "debug ip bgp updates", desc: "Debug BGP UPDATE messages" },
        ]
      },
      {
        title: "VLAN & Switching",
        commands: [
          { cmd: "show vlan brief", desc: "All VLANs — ID, name, active ports" },
          { cmd: "show interfaces trunk", desc: "Trunk ports — allowed VLANs, native VLAN, mode" },
          { cmd: "show spanning-tree vlan 10", desc: "STP state for VLAN 10 — root bridge, port roles/states" },
          { cmd: "show spanning-tree summary", desc: "STP summary — root ports, blocked ports" },
          { cmd: "show etherchannel summary", desc: "EtherChannel/LAG status — bundled interfaces" },
          { cmd: "vlan 10\n  name SALES\ninterface Gi0/1\n  switchport mode access\n  switchport access vlan 10", desc: "Create VLAN and assign access port" },
          { cmd: "interface Gi0/2\n  switchport mode trunk\n  switchport trunk allowed vlan 10,20,30\n  switchport trunk native vlan 999", desc: "Configure trunk — specific VLANs allowed, native VLAN set" },
          { cmd: "spanning-tree vlan 10 root primary", desc: "Force this switch to be STP root for VLAN 10" },
          { cmd: "interface range Gi0/1-2\n  channel-group 1 mode active", desc: "Create LACP EtherChannel on interfaces 1 and 2" },
        ]
      },
      {
        title: "HSRP / VRRP (Gateway Redundancy)",
        commands: [
          { cmd: "show standby brief", desc: "HSRP status — active/standby, virtual IP, priority" },
          { cmd: "show standby", desc: "Detailed HSRP group info — preempt, timers" },
          { cmd: "interface Vlan10\n  standby 10 ip 192.168.10.1\n  standby 10 priority 110\n  standby 10 preempt", desc: "HSRP config — virtual IP, priority 110 (higher = active), preempt" },
          { cmd: "show vrrp brief", desc: "VRRP state — master/backup, virtual IP" },
          { cmd: "interface Gi0/1\n  vrrp 1 ip 192.168.1.1\n  vrrp 1 priority 120\n  vrrp 1 preempt", desc: "VRRP config on interface" },
        ]
      },
      {
        title: "Port Security & General",
        commands: [
          { cmd: "show port-security interface Gi0/5", desc: "Port security status — max MACs, violation mode, count" },
          { cmd: "interface Gi0/5\n  switchport port-security\n  switchport port-security maximum 2\n  switchport port-security violation restrict\n  switchport port-security mac-address sticky", desc: "Enable port security — max 2 MACs, sticky learning, restrict violation" },
          { cmd: "show mac address-table", desc: "CAM table — MAC to port mapping" },
          { cmd: "show cdp neighbors detail", desc: "CDP neighbor info — IP, platform, interface" },
          { cmd: "show ip int brief", desc: "All interfaces — IP, status, protocol" },
          { cmd: "show logging", desc: "System log buffer" },
          { cmd: "debug ip packet 101 detail", desc: "Debug packets matching ACL 101 — use carefully, high CPU" },
        ]
      },
    ]
  },
  {
    id: "cloud",
    name: "AWS / Azure Networking",
    color: "#ff9900",
    bg: "#1a0d00",
    icon: "☁️",
    experience: "Supported at Capgemini & Infosys — VPN/ExpressRoute/Direct Connect handoffs to cloud teams. AWS VPC, Azure VNet, NSGs, WAF exposure.",
    sections: [
      {
        title: "AWS Key Concepts (Interview Ready)",
        commands: [
          { cmd: "VPC (Virtual Private Cloud)", desc: "Isolated network in AWS — your own address space. Like an on-prem network in cloud." },
          { cmd: "Subnet", desc: "Segment within VPC — public (internet-routable) or private. Each in one AZ." },
          { cmd: "Internet Gateway (IGW)", desc: "Connects VPC to internet — attached to VPC, used by public subnets." },
          { cmd: "NAT Gateway", desc: "Allows private subnet instances to reach internet — outbound only, managed service." },
          { cmd: "Security Group", desc: "Stateful firewall on EC2 instance/ENI level — allow rules only, no deny. Default deny-all inbound." },
          { cmd: "Network ACL (NACL)", desc: "Stateless firewall at subnet level — allow AND deny rules, numbered priority." },
          { cmd: "VPN Gateway + Customer Gateway", desc: "Site-to-Site VPN between on-prem and AWS VPC — your handoff work at Capgemini." },
          { cmd: "Direct Connect", desc: "Dedicated private circuit from on-prem to AWS — lower latency, higher bandwidth than VPN." },
          { cmd: "Transit Gateway", desc: "Hub to connect multiple VPCs and on-prem — replaces complex VPC peering meshes." },
          { cmd: "Application Load Balancer + WAF", desc: "Layer 7 LB with Web Application Firewall — worked with cloud teams on WAF config." },
        ]
      },
      {
        title: "Azure Key Concepts",
        commands: [
          { cmd: "VNet (Virtual Network)", desc: "Azure equivalent of AWS VPC — isolated network with address space." },
          { cmd: "NSG (Network Security Group)", desc: "Stateful firewall rules on subnet or NIC level — allow/deny, priority-based." },
          { cmd: "Azure VPN Gateway", desc: "Site-to-Site VPN from on-prem to Azure VNet — IKEv2, BGP-capable." },
          { cmd: "ExpressRoute", desc: "Private dedicated circuit to Azure — like AWS Direct Connect. Your handoff scope at Capgemini." },
          { cmd: "Azure Firewall", desc: "Managed network firewall — FQDN filtering, DNAT, SNAT, policy tiers." },
          { cmd: "Application Gateway + WAF", desc: "Layer 7 load balancer with WAF — OWASP rule sets, custom rules." },
          { cmd: "UDR (User Defined Route)", desc: "Custom routes in Azure — force traffic through NVA (firewall VM) or VPN gateway." },
          { cmd: "VNet Peering", desc: "Connect two VNets privately — traffic stays on Microsoft backbone, no public internet." },
        ]
      },
    ]
  },
];

const INTERVIEW_QA = [
  { q: "What is Zero Trust and how did you implement it with Illumio?", a: "Zero Trust means 'never trust, always verify' — assume breach and restrict all lateral movement. With Illumio Core at Insight Global, I implemented it by installing VEN agents on every workload, assigning labels (Role/App/Env/Loc), and building rulesets that explicitly allowed only needed flows. I progressed workloads from Visibility Only → Selective → Full enforcement, reducing the blast radius if any workload was compromised. The key is policy is written against labels, not IPs — so it scales automatically as workloads move." },
  { q: "Difference between IKE Phase 1 and Phase 2?", a: "Phase 1 (ISAKMP SA): establishes a secure, authenticated channel between two peers using the configured IKE policy (encryption, hash, DH group, authentication). Creates one bidirectional SA. Commands: show crypto isakmp sa — should show MM_ACTIVE (main mode) or AG_ACTIVE (aggressive mode). Phase 2 (IPsec SA): uses the Phase 1 tunnel to negotiate the actual data encryption parameters (transform set) and interesting traffic (ACL/selectors). Creates two unidirectional SAs (one each way). Commands: show crypto ipsec sa — check encaps/decaps counters are incrementing." },
  { q: "How do you troubleshoot a VPN tunnel that's down?", a: "1) Check Phase 1: show crypto isakmp sa — is it showing ACTIVE or blank? If blank, Phase 1 failed. 2) Check Phase 2: show crypto ipsec sa — are encaps/decaps incrementing? If Phase 1 is up but Phase 2 isn't, mismatch in transform set or ACL. 3) Verify interesting traffic: ensure both sides have mirror-image ACLs or selectors. 4) Check routing: can the firewall reach the peer IP? 5) Enable debug: debug crypto isakmp 127 and debug crypto ipsec 127 — review negotiation failure reason. Most common causes: PSK mismatch, policy mismatch (encryption/hash/DH group), incorrect peer IP, NAT on the path." },
  { q: "Active/Standby vs Active/Active HA — when do you use each?", a: "Active/Standby: one unit processes all traffic, standby is hot-spare ready to take over. Simpler, stateful failover. Used when simplicity and cost matter. Active/Active: both units process traffic simultaneously, each acting as primary for different contexts/zones. Doubles throughput but requires asymmetric routing or ECMP. More complex to configure and troubleshoot. At Insight Global/Infosys, I managed Active/Standby for ASA and FortiGate — monitored with 'show failover' and 'get system ha status', and synced configs with 'write standby'." },
  { q: "What is micro-segmentation and why is it better than traditional perimeter security?", a: "Traditional perimeter security protects the north-south boundary (in/out of the network) but once an attacker is inside, they can move laterally freely — like a burglar inside a building with no internal locks. Micro-segmentation (what I did with Illumio) applies controls to east-west traffic between workloads inside the network. Even if one server is compromised, it cannot reach other servers unless an explicit allow rule exists. Illumio does this at the workload level using VEN agents — so it works regardless of network topology, cloud, or VM migration." },
  { cmd: "What is the difference between NAT and PAT?", q: "What is the difference between NAT and PAT?", a: "NAT (Network Address Translation): maps one private IP to one public IP — one-to-one. Used for servers needing consistent public IPs. PAT (Port Address Translation) / Overloading: maps many private IPs to one public IP, differentiated by source port number. Used for outbound internet access from many users sharing one IP. In Cisco ASA: 'nat (inside,outside) dynamic interface' = PAT using interface IP. In FortiGate: set nat enable on policy = PAT using egress interface." },
];

export default function InterviewPrep() {
  const [activeVendor, setActiveVendor] = useState("cisco-asa");
  const [activeSection, setActiveSection] = useState(0);
  const [activeTab, setActiveTab] = useState("commands");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState("");
  const [expandedQ, setExpandedQ] = useState(null);

  const vendor = VENDORS.find(v => v.id === activeVendor);

  const allCommands = vendor?.sections.flatMap(s =>
    s.commands.map(c => ({ ...c, section: s.title }))
  ) || [];

  const filtered = search.trim().length > 1
    ? allCommands.filter(c =>
        c.cmd.toLowerCase().includes(search.toLowerCase()) ||
        c.desc.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  const displaySection = vendor?.sections[activeSection];

  const copy = (text) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(text);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div style={{
      fontFamily: "'DM Mono', 'Fira Code', 'Courier New', monospace",
      background: "#0d0d0d",
      minHeight: "100vh",
      color: "#e0e0e0",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Top Bar */}
      <div style={{
        background: "#111",
        borderBottom: "1px solid #222",
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 10,
      }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: 1, fontFamily: "'DM Mono', monospace" }}>
            <span style={{ color: "#6c63ff" }}>$</span> SAMEER's Interview Prep
          </div>
          <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>Network Security Engineer — Commands Reference</div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6 }}>
          {["commands", "interview"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              background: activeTab === tab ? "#6c63ff" : "transparent",
              border: `1px solid ${activeTab === tab ? "#6c63ff" : "#333"}`,
              color: activeTab === tab ? "#fff" : "#888",
              padding: "6px 16px",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 12,
              fontFamily: "inherit",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}>
              {tab === "commands" ? "⌨ Commands" : "💬 Interview Q&A"}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "commands" && (
        <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 600 }}>
          {/* Sidebar — Vendor List */}
          <div style={{
            width: 200,
            background: "#111",
            borderRight: "1px solid #1e1e1e",
            padding: "12px 0",
            flexShrink: 0,
            overflowY: "auto",
          }}>
            {VENDORS.map(v => (
              <div key={v.id}
                onClick={() => { setActiveVendor(v.id); setActiveSection(0); setSearch(""); }}
                style={{
                  padding: "10px 16px",
                  cursor: "pointer",
                  background: activeVendor === v.id ? "#1a1a2e" : "transparent",
                  borderLeft: activeVendor === v.id ? `3px solid ${v.color}` : "3px solid transparent",
                  transition: "all 0.15s",
                }}>
                <div style={{ fontSize: 13, color: activeVendor === v.id ? v.color : "#aaa", fontWeight: activeVendor === v.id ? 700 : 400 }}>
                  {v.icon} {v.name}
                </div>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Vendor Header */}
            <div style={{
              padding: "14px 20px",
              background: "#111",
              borderBottom: "1px solid #1e1e1e",
            }}>
              <div style={{ fontSize: 15, color: vendor?.color, fontWeight: 700, marginBottom: 4 }}>
                {vendor?.icon} {vendor?.name}
              </div>
              <div style={{ fontSize: 11, color: "#666", lineHeight: 1.5 }}>
                📋 {vendor?.experience}
              </div>

              {/* Search */}
              <div style={{ marginTop: 10, position: "relative" }}>
                <input
                  placeholder="Search commands or descriptions..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: 6,
                    padding: "7px 12px",
                    color: "#e0e0e0",
                    fontSize: 12,
                    fontFamily: "inherit",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Section Tabs */}
            {!filtered && (
              <div style={{
                display: "flex",
                gap: 0,
                background: "#0d0d0d",
                borderBottom: "1px solid #1e1e1e",
                overflowX: "auto",
                flexShrink: 0,
              }}>
                {vendor?.sections.map((s, i) => (
                  <div key={i} onClick={() => setActiveSection(i)} style={{
                    padding: "9px 16px",
                    fontSize: 11,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    borderBottom: activeSection === i ? `2px solid ${vendor.color}` : "2px solid transparent",
                    color: activeSection === i ? vendor.color : "#555",
                    fontWeight: activeSection === i ? 700 : 400,
                    transition: "color 0.15s",
                    letterSpacing: 0.5,
                  }}>
                    {s.title}
                  </div>
                ))}
              </div>
            )}

            {/* Commands List */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
              {(filtered || displaySection?.commands || []).map((item, i) => (
                <div key={i} style={{
                  background: "#111",
                  border: "1px solid #1e1e1e",
                  borderRadius: 8,
                  marginBottom: 10,
                  overflow: "hidden",
                  transition: "border-color 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#333"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#1e1e1e"}
                >
                  {filtered && (
                    <div style={{ padding: "4px 12px", background: "#1a1a1a", fontSize: 10, color: "#555", letterSpacing: 1, textTransform: "uppercase" }}>
                      {item.section}
                    </div>
                  )}
                  <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <pre style={{
                        margin: 0,
                        fontSize: 13,
                        color: vendor?.color || "#6c63ff",
                        fontFamily: "inherit",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        lineHeight: 1.6,
                      }}>{item.cmd}</pre>
                      <div style={{ fontSize: 12, color: "#777", marginTop: 6, lineHeight: 1.5 }}>
                        → {item.desc}
                      </div>
                    </div>
                    <button onClick={() => copy(item.cmd)} style={{
                      background: copied === item.cmd ? "#1a2e1a" : "#1a1a1a",
                      border: `1px solid ${copied === item.cmd ? "#2a5a2a" : "#2a2a2a"}`,
                      color: copied === item.cmd ? "#6fbf6f" : "#666",
                      padding: "4px 10px",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 11,
                      fontFamily: "inherit",
                      flexShrink: 0,
                      transition: "all 0.2s",
                    }}>
                      {copied === item.cmd ? "✓ copied" : "copy"}
                    </button>
                  </div>
                </div>
              ))}
              {filtered && filtered.length === 0 && (
                <div style={{ color: "#444", fontSize: 13, textAlign: "center", marginTop: 40 }}>
                  No commands found for "{search}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "interview" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", maxWidth: 800, margin: "0 auto", width: "100%" }}>
          <div style={{ fontSize: 12, color: "#555", marginBottom: 16, letterSpacing: 1, textTransform: "uppercase" }}>
            Top interview questions based on your experience
          </div>
          {INTERVIEW_QA.map((qa, i) => (
            <div key={i} style={{
              background: "#111",
              border: `1px solid ${expandedQ === i ? "#6c63ff" : "#1e1e1e"}`,
              borderRadius: 8,
              marginBottom: 10,
              overflow: "hidden",
              transition: "border-color 0.2s",
            }}>
              <div
                onClick={() => setExpandedQ(expandedQ === i ? null : i)}
                style={{
                  padding: "14px 16px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}>
                <div style={{ fontSize: 13, color: "#ddd", lineHeight: 1.5 }}>
                  <span style={{ color: "#6c63ff", marginRight: 8 }}>Q{i + 1}.</span>
                  {qa.q}
                </div>
                <div style={{ color: "#444", fontSize: 16, flexShrink: 0 }}>
                  {expandedQ === i ? "▲" : "▼"}
                </div>
              </div>
              {expandedQ === i && (
                <div style={{
                  padding: "0 16px 16px",
                  borderTop: "1px solid #1e1e1e",
                  paddingTop: 14,
                }}>
                  <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.8 }}>
                    {qa.a}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
