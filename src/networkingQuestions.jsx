import { useState } from "react";

const NETWORKING_CATEGORIES = [
  {
    id: "fundamentals",
    name: "Networking Fundamentals",
    icon: "🌐",
    color: "#00d4ff",
    questions: [
      {
        q: "Explain the OSI model and each layer.",
        a: "7 layers: Application (HTTP, DNS, FTP), Presentation (encryption, compression), Session (conversation management), Transport (TCP, UDP), Network (IP routing), Data Link (MAC, switching), Physical (cables, signals). Each layer encapsulates data from above.",
      },
      {
        q: "What is the difference between TCP and UDP?",
        a: "TCP: connection-oriented, reliable, ordered delivery, slower, uses handshake. UDP: connectionless, unreliable, unordered, faster, no handshake. TCP for email/FTP/HTTP, UDP for streaming/gaming/DNS.",
      },
      {
        q: "Explain the TCP three-way handshake.",
        a: "SYN: client sends sequence number to server. SYN-ACK: server responds with its sequence + acknowledges client. ACK: client acknowledges server. Establishes connection before data transfer.",
      },
      {
        q: "What is IP addressing and subnetting?",
        a: "IP: 32-bit (IPv4) or 128-bit (IPv6) address. Subnet mask determines network portion. Classless subnetting: /24 = 256 hosts, /25 = 128 hosts. Calculate: network address, broadcast, usable IPs.",
      },
      {
        q: "Explain IPv4 vs IPv6.",
        a: "IPv4: 32-bit, 4.3 billion addresses, decimal. IPv6: 128-bit, 340 undecillion addresses, hexadecimal. IPv6: larger address space, simpler header, built-in security (IPsec), no NAT needed.",
      },
      {
        q: "What is CIDR notation?",
        a: "Classless Inter-Domain Routing: 192.168.1.0/24 means 256 addresses (0-255). /32 = single host, /31 = point-to-point link, /30 = 4 addresses (2 usable), /25 = 128 addresses.",
      },
      {
        q: "Explain ARP (Address Resolution Protocol).",
        a: "Maps IP addresses to MAC addresses. Host broadcasts ARP request 'who has IP X?', target responds with MAC. Result cached in ARP table. ARP spoofing attack possible - sends fake ARP replies.",
      },
      {
        q: "What is DHCP?",
        a: "Dynamic Host Configuration Protocol assigns IPs automatically. DISCOVER: client broadcasts, OFFER: server responds, REQUEST: client requests, ACK: server confirms. Lease duration configurable. Reduces manual config.",
      },
      {
        q: "Explain DNS and how it works.",
        a: "Domain Name System translates names to IPs. Recursive query: client→resolver→root→TLD→authoritative. Iterative query: nameserver queries others. Caching at each level. TTL controls cache duration.",
      },
      {
        q: "What are DNS record types?",
        a: "A: IPv4 address. AAAA: IPv6. CNAME: alias. MX: mail server. NS: nameserver. SOA: start of authority. PTR: reverse DNS. TXT: text record. SPF, DKIM for email authentication.",
      },
      {
        q: "Explain NAT (Network Address Translation).",
        a: "Maps private IPs to public IP. Static NAT: one-to-one mapping. Dynamic NAT: many-to-one on public pool. PAT/NAPT: many-to-one using ports. Hides internal network, saves public IPs.",
      },
      {
        q: "What is port forwarding?",
        a: "Maps external port to internal IP:port. Example: external 8080 → internal 192.168.1.100:80. Enables remote access to internal services. Used in firewalls, routers.",
      },
      {
        q: "Explain QoS (Quality of Service).",
        a: "Prioritizes traffic based on type/port/protocol. Queuing disciplines: FIFO, priority queuing, weighted fair. Reduces latency for critical traffic (VoIP), limits bandwidth hogs. Improves user experience.",
      },
      {
        q: "What is bandwidth and latency?",
        a: "Bandwidth: maximum data rate (Mbps/Gbps). Latency: delay in transmission (milliseconds). Both matter: high bandwidth with high latency still slow for interactive apps. 1Gbps with 100ms latency = 100MB in flight.",
      },
      {
        q: "Explain broadcast and multicast.",
        a: "Broadcast: frame to all hosts on network (FF:FF:FF:FF:FF:FF). Multicast: to group of hosts (224.0.0.0/4 reserved). Unicast: one-to-one. Broadcast floods network, multicast controlled group.",
      },
      {
        q: "What is a default gateway?",
        a: "Router interface for traffic destined outside local network. Host checks destination IP: if in local subnet, send directly; else send to default gateway. Gateway forwards to destination network.",
      },
      {
        q: "Explain the three-way handshake teardown.",
        a: "FIN: initiator sends finish. ACK: responder acknowledges. FIN: responder sends finish. ACK: initiator acknowledges. Graceful close. RST abruptly closes (flag: 1). TIME-WAIT prevents delayed packets.",
      },
      {
        q: "What is MTU (Maximum Transmission Unit)?",
        a: "Largest frame size network can transmit. Ethernet: 1500 bytes. Jumbo frames: 9000 bytes (better for LAN). Smaller MTU = more fragmentation. Larger MTU = fewer packets but longer retransmit.",
      },
      {
        q: "Explain fragmentation and reassembly.",
        a: "IP layer fragments packets larger than MTU. Each fragment has offset, more-fragments flag. Reassembled at destination. ICMP too large message triggers path MTU discovery. Fragments can get lost, reduced throughput.",
      },
      {
        q: "What is ICMP and what does ping do?",
        a: "Internet Control Message Protocol: error reporting (destination unreachable), diagnostics. Ping: ICMP echo request/reply measures latency. Traceroute: ICMP TTL exceeded finds path to destination.",
      },
    ],
  },
  {
    id: "routing",
    name: "Routing Protocols",
    icon: "🛣️",
    color: "#69db7c",
    questions: [
      {
        q: "What is static vs dynamic routing?",
        a: "Static: manually configured routes, no adaptation to network changes. Dynamic: automatically updates routes based on topology changes. IGP (interior): OSPF, EIGRP, RIP. EGP (exterior): BGP.",
      },
      {
        q: "Explain RIP (Routing Information Protocol).",
        a: "Distance-vector protocol, metric: hop count (max 15). Broadcasts entire routing table every 30s. Slow convergence, high overhead. RIPv1: classful, RIPv2: classless, supports VLSM. Rarely used now.",
      },
      {
        q: "What is OSPF (Open Shortest Path First)?",
        a: "Link-state protocol, metric: cost (bandwidth-based, default 100M/bandwidth). Uses Dijkstra algorithm. Fast convergence, hello/dead timers. Areas reduce overhead. Support for multiarea. Industry standard.",
      },
      {
        q: "Explain EIGRP (Enhanced Interior Gateway Routing Protocol).",
        a: "Cisco proprietary, hybrid (distance-vector + link-state). Metric: bandwidth + delay. Faster convergence than OSPF. Feasible successor enables loop prevention. Support for multiprotocol.",
      },
      {
        q: "What is BGP (Border Gateway Protocol)?",
        a: "EGP for inter-AS routing. Attributes: AS path, local preference, MED. Slow convergence but stable. TCP 179. Policies control traffic. iBGP (internal), eBGP (external). Complex but necessary for ISPs.",
      },
      {
        q: "Explain AD (Administrative Distance).",
        a: "Trustworthiness of routing source: directly connected (0), static (1), EIGRP (90), OSPF (110), RIP (120), BGP (20 iBGP, 200 eBGP). Lower AD = more trusted. Determines route selection.",
      },
      {
        q: "What is routing protocol convergence?",
        a: "Time to detect topology change and update routing tables. RIP: slow (minutes). EIGRP/OSPF: fast (seconds). BGP: slow (minutes). Faster convergence = less packet loss, better availability.",
      },
      {
        q: "Explain equal cost multipath (ECMP).",
        a: "Load balancing across multiple equal-cost paths. Distributes traffic across links. Improves bandwidth utilization, redundancy. Requires compatible routing protocols and same metrics.",
      },
      {
        q: "What is a routing table?",
        a: "Database of routes: destination network, next-hop, metric, outgoing interface. Longest prefix match: most specific route wins. Default route: 0.0.0.0/0 catches all unmatched. Sorted by metric.",
      },
      {
        q: "Explain metric in routing protocols.",
        a: "Cost determining best path. RIP: hop count. OSPF: cost = 100M/bandwidth. EIGRP: bandwidth + delay. BGP: uses policies. Lower metric = preferred. Influences routing decisions.",
      },
      {
        q: "What is a default route?",
        a: "0.0.0.0/0 catches all traffic not matching specific routes. Usually points to ISP gateway. Used in stub networks, edge routers. Reduces routing table size.",
      },
      {
        q: "Explain BGP attributes.",
        a: "AS Path: AS numbers traversed. Local Preference: prefer path (default 100). MED: suggest exit point. Weight: Cisco proprietary (0-65535). Community: group routes. Used in policy-based routing.",
      },
      {
        q: "What is route poisoning and split horizon?",
        a: "Route poisoning: marks unreachable route as infinity (16 in RIP). Split horizon: don't advertise routes back to source. Prevents routing loops. Triggered update accelerates convergence.",
      },
      {
        q: "Explain OSPF areas.",
        a: "Backbone area (area 0) connects other areas. ABR (area border router) between areas. ASBR (autonomous system boundary router) connects to other ASs. Reduces flooding, speeds convergence.",
      },
      {
        q: "What is an intra-area vs inter-area route in OSPF?",
        a: "Intra-area: within same area, SPF calculation. Inter-area: between areas, ABR filters/summarizes. Inter-area routes have higher cost. Areas scale OSPF by reducing LSA flooding.",
      },
      {
        q: "Explain EIGRP feasible successor.",
        a: "Backup route meeting feasibility condition: reported distance < feasible distance. Enables fast convergence without waiting for convergence timer. Precomputed path for protection.",
      },
      {
        q: "What is BGP peering?",
        a: "TCP connection between BGP routers. iBGP: same AS, eBGP: different AS. RR (route reflector) reduces iBGP connections from full mesh O(n²) to O(n). Simplifies scaling.",
      },
      {
        q: "Explain BGP route filtering.",
        a: "Prefix lists: match IP prefixes. AS path filters: block/allow AS numbers. Route maps: complex conditions. Used for traffic engineering, security. Prevents unauthorized routes.",
      },
      {
        q: "What is a routing loop?",
        a: "Packet circulates between routers infinitely. Caused by inconsistent routing tables. Prevented by: split horizon, route poisoning, EIGRP feasible successor, TTL decrement. Reduces network efficiency.",
      },
      {
        q: "Explain black hole routing.",
        a: "Route points to null/discard interface intentionally. Used for blocking traffic, DDoS mitigation. Packets discarded without returning error. Difference: routing loop = unintended circulation.",
      },
    ],
  },
  {
    id: "switching",
    name: "Switching & VLAN",
    icon: "🔀",
    color: "#ffa94d",
    questions: [
      {
        q: "Explain the MAC address and its format.",
        a: "48-bit address: 24-bit OUI (vendor) + 24-bit device. Hexadecimal: 00:1A:2B:3C:4D:5E. First bit: unicast (0) or multicast (1). Second bit: universally unique (0) or locally unique (1).",
      },
      {
        q: "What is STP (Spanning Tree Protocol)?",
        a: "Prevents loops in switched networks. Elects root bridge (lowest priority + MAC). Blocks ports with higher cost to root. BPDU: bridge protocol data unit. Detects topology changes, blocks/unblocks ports.",
      },
      {
        q: "Explain STP port states.",
        a: "Disabled: no forwarding, blocked by admin. Listening: receives BPDUs, doesn't learn MACs. Learning: learns MACs, doesn't forward data. Forwarding: normal operation. Blocking: receives BPDUs, prevents loops.",
      },
      {
        q: "What is RSTP (Rapid Spanning Tree Protocol)?",
        a: "Faster convergence than STP (~6 seconds → 1-2 seconds). Introduces port roles: root, designated, alternate. Proposal/agreement handshake. Active topology change tracking. Better than original STP.",
      },
      {
        q: "Explain VLAN (Virtual LAN).",
        a: "Logically separates network into multiple broadcast domains. VLANs can span switches via trunk links (tagged frames). Reduces broadcast, improves security. Different VLANs need router/L3 switch for communication.",
      },
      {
        q: "What is a trunk port?",
        a: "Switch port carrying multiple VLANs using tags (802.1Q). Adds 4-byte tag with VLAN ID. Native VLAN: untagged frames. Connects switches, not end devices. Enables VLAN spanning.",
      },
      {
        q: "Explain 802.1Q tagging.",
        a: "Adds 4-byte VLAN tag: TPID (2 bytes, 0x8100), PCP (3 bits priority), DEI (1 bit), VID (12 bits, 0-4095). VID 0 reserved, 4094 available. Tags inserted on trunk, stripped on access.",
      },
      {
        q: "What is an access port?",
        a: "Switch port connected to end device. Belongs to single VLAN. Receives/sends untagged frames. Automatically tags ingress, strips tags on egress. Not aware of other VLANs.",
      },
      {
        q: "Explain VLAN routing.",
        a: "Inter-VLAN communication requires router or L3 switch. Router on stick: single link tagged with VLANs. SVI (switched virtual interface): VLAN interface on L3 switch. Default gateway for VLAN.",
      },
      {
        q: "What is a native VLAN?",
        a: "Untagged traffic on trunk port. Default: VLAN 1. Frames without tag belong to native VLAN. Should match on both ends to prevent security issues. Can be changed per trunk.",
      },
      {
        q: "Explain VLAN hopping attack.",
        a: "Attacker sends frames tagged for unauthorized VLAN. Bypass VLAN isolation. Prevention: disable trunking on access ports, change native VLAN from 1, use explicit tagging.",
      },
      {
        q: "What is a multi-access network?",
        a: "Network where multiple devices share same medium (Ethernet switch). Addressed by MAC. Device learns MAC table from source, forwards to destination. Broadcast to unknown destinations.",
      },
      {
        q: "Explain MAC address table learning.",
        a: "Switch learns MAC from source address on incoming frame. Updates interface mapping. Ages out if no activity (default 5 minutes). Enables intelligent forwarding instead of flooding.",
      },
      {
        q: "What is CAM (Content Addressable Memory)?",
        a: "MAC address table stored in CAM. Fast lookup by MAC (TCAM for ternary: wildcards). Limited size (typical 8K-16K MACs). Overflow causes flooding. Tuning priority matching.",
      },
      {
        q: "Explain flooding in switches.",
        a: "Switch floods frame to all ports when destination MAC unknown or broadcast. Enables broadcast connectivity, slow on large networks. VLAN limits flooding scope. STP prevents loop flooding.",
      },
      {
        q: "What is port mirroring/SPAN?",
        a: "Copies traffic from one port to another for monitoring. Source/destination ports configurable. Used with packet analyzer (Wireshark). Improves troubleshooting without inline tools.",
      },
      {
        q: "Explain PortFast and BPDU Guard.",
        a: "PortFast: skips listening/learning states on access ports (instant forwarding). BPDU Guard: disables port if BPDU received (prevents unauthorized STP). Used together for safety.",
      },
      {
        q: "What is a loop-free topology?",
        a: "Network without redundant paths that cause loops. Achieved with STP blocking ports. Single tree spans network. Zero packet circulation. Cost: lost redundancy if link fails.",
      },
      {
        q: "Explain network segmentation with VLANs.",
        a: "Separate departments, security zones into VLANs. Guest network isolated from corporate. Limits broadcast, improves security. Device VLAN = device group assignment. Management VLAN for admin access.",
      },
      {
        q: "What is a collapsed core network architecture?",
        a: "L3 switch acts as backbone. Distribution and core layers combined. Simpler, cost-effective for small networks. VLAN interfaces on switch provide L3 routing. Scale limit: fewer hops.",
      },
    ],
  },
  {
    id: "firewall-security",
    name: "Firewall & Security",
    icon: "🔒",
    color: "#ff6b6b",
    questions: [
      {
        q: "What is a firewall?",
        a: "Network security system controlling traffic between networks. Stateless: checks each packet independently. Stateful: tracks connection state. Next-gen: application-aware, IPS, DPI. Prevents unauthorized access.",
      },
      {
        q: "Explain ACL (Access Control List).",
        a: "Rules allowing/denying traffic by source, destination, port, protocol. Ordered: first match wins. Standard: source IP only. Extended: source, destination, protocol, port. Applied inbound/outbound.",
      },
      {
        q: "What is a firewall zone/context?",
        a: "Logical partition on firewall. Inside zone: trusted network. Outside zone: untrusted (internet). DMZ: demilitarized zone for public servers. Policies between zones control traffic.",
      },
      {
        q: "Explain stateful firewall inspection.",
        a: "Tracks connection states: new, established, related. Allows return traffic for outbound connections. Blocks unsolicited inbound. More secure, higher overhead than stateless. Modern standard.",
      },
      {
        q: "What is an IPS/IDS?",
        a: "IDS (intrusion detection): monitors and alerts. IPS (intrusion prevention): blocks attacks. Signature-based: known attacks. Anomaly-based: unusual behavior. Network-based vs host-based.",
      },
      {
        q: "Explain DPI (Deep Packet Inspection).",
        a: "Analyzes packet payload beyond headers. Detects P2P, encrypted traffic, malware. Next-gen firewalls use DPI. Can decrypt SSL/TLS for inspection. Higher CPU cost.",
      },
      {
        q: "What is a DMZ?",
        a: "Demilitarized zone isolates public services (web, mail, DNS). Between inside and outside. Traffic between DMZ and inside controlled. Compromised DMZ server doesn't access inside network.",
      },
      {
        q: "Explain implicit deny principle.",
        a: "Everything denied unless explicitly allowed. Deny rule at end of ACL. More secure: whitelist approach. Alternative: implicit allow (less secure, accept all by default).",
      },
      {
        q: "What is a firewall rule?",
        a: "Action (allow/deny) based on: source/destination IP, port, protocol, direction. Priority ordered. Policy-based: multiple criteria. Enable advanced filtering, enforcement.",
      },
      {
        q: "Explain ingress vs egress filtering.",
        a: "Ingress: filter incoming traffic at network edge. Egress: filter outgoing traffic. Egress prevents data exfiltration, malware C&C communication. Both recommended for security.",
      },
      {
        q: "What is NAT security benefit?",
        a: "Hides internal IPs from external view. Attackers see only external IP. Reduces reconnaissance. Combined with firewall for defense-in-depth. Doesn't replace firewall.",
      },
      {
        q: "Explain SSL/TLS inspection.",
        a: "Decrypt HTTPS traffic for inspection. Man-in-the-middle between client and server. Reveals encrypted threat payload. Privacy/legal concerns. Requires certificate authority setup.",
      },
      {
        q: "What is VPN (Virtual Private Network)?",
        a: "Encrypted tunnel between networks/devices. Site-to-site: networks connected. Remote access: individual devices. IPsec, SSL/TLS protocols. Confidentiality, integrity, authentication over public internet.",
      },
      {
        q: "Explain IPsec protocol.",
        a: "Internet Protocol Security. Authentication Header (AH): integrity. Encapsulating Security Payload (ESP): confidentiality. Transport mode: between hosts. Tunnel mode: between gateways.",
      },
      {
        q: "What is an IPsec tunnel?",
        a: "Encrypted tunnel between two gateways. Transparent to end devices. Original packet encapsulated with new IP header. Negotiates SA (security association) with IKE.",
      },
      {
        q: "Explain IKE (Internet Key Exchange).",
        a: "Protocol establishing IPsec SA. Two phases: Phase 1 (authentication, keys), Phase 2 (IPsec parameters). DH (Diffie-Hellman) key exchange. Supports various authentication methods.",
      },
      {
        q: "What is GRE tunneling?",
        a: "Generic Routing Encapsulation encapsulates packets. Non-encrypted, used inside IPsec. Enables multicast/broadcast tunneling. Simple but unencrypted, needs IPsec for security.",
      },
      {
        q: "Explain port security on switches.",
        a: "Limits MAC addresses per port. Restricts device access. Violation actions: shutdown, restrict, protect. Prevents rogue devices, MAC spoofing. Improves network security.",
      },
      {
        q: "What is network segmentation?",
        a: "Dividing network into smaller segments with controlled access. VLANs, DMZ, zones. Limits breach impact: compromised segment isolated. Improves security posture, compliance.",
      },
      {
        q: "Explain defense-in-depth strategy.",
        a: "Multiple security layers: firewall, IPS, VPN, DPI, endpoint security. Single point failure doesn't compromise security. Redundancy. Industry best practice.",
      },
    ],
  },
  {
    id: "aws-networking",
    name: "AWS Networking",
    icon: "☁️",
    color: "#ff9900",
    questions: [
      {
        q: "What is AWS VPC (Virtual Private Cloud)?",
        a: "Isolated network in AWS. Customizable IP range (CIDR block). Contains subnets, route tables, security groups. Public subnet: internet-facing. Private subnet: internal only. Foundation of AWS networking.",
      },
      {
        q: "Explain public vs private subnets.",
        a: "Public: route to internet gateway (IGW). Has route 0.0.0.0/0 → IGW. Private: no direct internet access. Access via NAT gateway/instance. Resources in private have no public IPs.",
      },
      {
        q: "What is an Internet Gateway (IGW)?",
        a: "Enables communication between VPC and internet. Enables routing 0.0.0.0/0. Both directions: inbound + outbound. Highly available, no performance bottleneck. One per VPC.",
      },
      {
        q: "Explain NAT Gateway.",
        a: "Enables private instances to access internet. Outbound only: private instance → internet. Inbound: only responses to outbound requests. Managed service, auto-scaling. Costs per hour + data processed.",
      },
      {
        q: "What is a security group?",
        a: "Stateful firewall rules. Allows inbound + outbound traffic. Instance-level protection. Default denies inbound, allows outbound. Protocol, port, source IP/security group.",
      },
      {
        q: "Explain NACL (Network Access Control List).",
        a: "Stateless subnet-level firewall. Inbound + outbound rules separate. Numbered rules (lower wins). Default allows all. Less common than security groups but complementary.",
      },
      {
        q: "What is route table?",
        a: "Database of routes in subnet. Destination CIDR block → target (local, IGW, NAT, VPN, etc.). Priority: longest prefix match. One main route table per subnet.",
      },
      {
        q: "Explain VPC peering.",
        a: "Connects two VPCs privately. No data crosses internet. Requester/accepter relationship. Non-transitive: A-B, B-C doesn't connect A-C. Cross-region peering supported.",
      },
      {
        q: "What is AWS Transit Gateway?",
        a: "Connects multiple VPCs and on-premises networks. Hub-and-spoke model. Simplifies many VPC peering. Supports multicast. Centralized routing, simplified management.",
      },
      {
        q: "Explain VPN connection to AWS.",
        a: "Connects on-premises network to VPC. Customer gateway: on-premises side. Virtual private gateway: VPC side. IPsec tunnel. Encrypted. Enables hybrid cloud.",
      },
      {
        q: "What is AWS Direct Connect?",
        a: "Dedicated network connection to AWS. Private, consistent bandwidth. No internet traffic. Better performance, security, cost for high-volume data transfer.",
      },
      {
        q: "Explain Elastic IP (EIP).",
        a: "Static public IP for EC2 instances. Persists after stop/start. Can reassign to different instance. Associated with network interface. Pay if not attached.",
      },
      {
        q: "What is ENI (Elastic Network Interface)?",
        a: "Virtual network interface for EC2. MAC address, private IP, security groups. Multiple ENIs per instance. Supports multiple IPs. Transferable between instances.",
      },
      {
        q: "Explain VPC endpoints.",
        a: "Connects VPC to AWS services privately. Gateway endpoints: S3, DynamoDB. Interface endpoints: other services. No internet gateway needed. Reduces data exfiltration risk.",
      },
      {
        q: "What is AWS Load Balancer?",
        a: "Distributes traffic across instances. ELB: classic. ALB: application layer (HTTP/HTTPS). NLB: network layer (TCP/UDP). ELBv2. Improves availability, scalability.",
      },
      {
        q: "Explain Route 53.",
        a: "AWS DNS service. Domain registration, hosted zones. Routing policies: simple, weighted, latency-based, geolocation, failover. Health checks for automatic failover.",
      },
      {
        q: "What is CloudFront?",
        a: "AWS CDN service. Caches content at edge locations. Improves performance, reduces origin load. Supports HTTP/HTTPS, WebSocket. Origin: S3, EC2, custom servers.",
      },
      {
        q: "Explain VPC Flow Logs.",
        a: "Captures IP traffic in VPC. ENI, subnet, or VPC level. Records source/destination IPs, ports, protocol, action. Sent to CloudWatch Logs or S3. Troubleshooting, monitoring.",
      },
      {
        q: "What is AWS Systems Manager Session Manager?",
        a: "Secure shell access to instances without SSH. No bastion host needed. Encrypted session. Auditable via CloudTrail. Recommended over key-pair management.",
      },
      {
        q: "Explain AWS PrivateLink.",
        a: "Enables accessing services across VPCs privately. Endpoint service exposes resources. Consumers can access via VPC endpoint. No public internet required. Simplified architecture.",
      },
    ],
  },
  {
    id: "azure-networking",
    name: "Azure Networking",
    icon: "🔷",
    color: "#0078d4",
    questions: [
      {
        q: "What is Azure VNet (Virtual Network)?",
        a: "Isolated network in Azure. Custom IP range (CIDR). Contains subnets, network interfaces. Similar to AWS VPC. Foundation of Azure networking.",
      },
      {
        q: "Explain Azure subnets.",
        a: "Divide VNet into segments. Public subnet: route to internet. Private subnet: no internet route. Can delegate to services. Multiple subnets per VNet.",
      },
      {
        q: "What is Azure NSG (Network Security Group)?",
        a: "Stateful firewall rules. Inbound + outbound rules. Applied to subnet or NIC. Priority-based. Can contain application security groups for easier management.",
      },
      {
        q: "Explain Azure Application Security Groups (ASGs).",
        a: "Logical grouping of VMs. Simplifies NSG rules. Instead of IP addresses, reference ASGs. Multiple ASGs per NIC. Enables dynamic security policy.",
      },
      {
        q: "What is Azure Application Gateway?",
        a: "L7 load balancer. Routing based on URLs, hostnames, HTTP headers. WAF (Web Application Firewall) integration. SSL termination, autoscaling. Application-aware.",
      },
      {
        q: "Explain Azure Load Balancer.",
        a: "L4 load balancer. Public: distributes incoming internet traffic. Internal: load balances within VNet. Supports TCP/UDP. Basic and Standard tiers.",
      },
      {
        q: "What is Azure ExpressRoute?",
        a: "Dedicated connection to Azure. Bypasses internet. Consistent bandwidth, low latency. Supports hybrid networking. Data centers worldwide.",
      },
      {
        q: "Explain Azure VPN Gateway.",
        a: "VPN connectivity to Azure VNet. Site-to-site: on-premises to VNet. Point-to-site: individual users. Policy-based or route-based.",
      },
      {
        q: "What is Azure Virtual WAN?",
        a: "Managed service connecting multiple VNets and on-premises. Hub-and-spoke with built-in routing. Simplifies network complexity. Scales globally.",
      },
      {
        q: "Explain Azure Peering.",
        a: "Connects Azure VNets. VNet-to-VNet peering: within/between regions. Private connection. Non-transitive like AWS. Global peering supported.",
      },
      {
        q: "What is Azure NIC (Network Interface)?",
        a: "Virtual network interface for VM. Primary/secondary IPs. Associated with subnet, NSG. Properties: MAC address, DNS settings.",
      },
      {
        q: "Explain Azure Public IP.",
        a: "Static or dynamic IP for public connectivity. Associated with NIC or load balancer. Enables inbound internet connectivity. Different SKUs available.",
      },
      {
        q: "What is Azure Service Endpoints?",
        a: "Extends VNet identity to Azure services. Private connection to Storage, SQL, etc. Restricts service access to specific VNet. No NAT/internet required.",
      },
      {
        q: "Explain Azure Private Endpoints.",
        a: "Private IP in VNet for Azure services. Connections don't traverse internet. DNS integration. Multiple services per endpoint possible. Enhanced security.",
      },
      {
        q: "What is Azure DDoS Protection?",
        a: "Protects against DDoS attacks. Basic: free, always-on. Standard: paid, additional protection, 24/7 support. Monitors traffic, mitigates attacks.",
      },
      {
        q: "Explain Azure Firewall.",
        a: "Managed firewall service. Stateful inspection. Supports HTTP/HTTPS, non-HTTP protocols. Rules: application, network. Logs to Azure Monitor.",
      },
      {
        q: "What is Azure Network Watcher?",
        a: "Monitoring, diagnostics service. Connection monitor: connectivity between resources. Flow logs: traffic analysis. Packet capture, NSG flow logs.",
      },
      {
        q: "Explain Azure DNS.",
        a: "Hosting DNS domains in Azure. Supports public, private zones. Private zones: DNS resolution within VNet. Integration with Azure services.",
      },
      {
        q: "What is Azure Traffic Manager?",
        a: "Global load balancing. Geolocation, performance-based routing. Health monitoring, automatic failover. Application-level (L7) not connection-level.",
      },
      {
        q: "Explain Azure Content Delivery Network (CDN).",
        a: "Microsoft CDN service. Edge locations worldwide. Improves performance, reduces origin load. Integration with Storage, App Service.",
      },
    ],
  },
  {
    id: "gcp-networking",
    name: "GCP Networking",
    icon: "🔴",
    color: "#db4437",
    questions: [
      {
        q: "What is GCP VPC (Virtual Private Cloud)?",
        a: "Isolated network in GCP. Global resource. Subnets per region. Custom IP ranges. Routes, firewalls within VPC.",
      },
      {
        q: "Explain GCP subnets.",
        a: "Regional resources within VPC. Private IP range. Can enable flow logs. Secondary IP ranges for multiple services. More flexible than AWS.",
      },
      {
        q: "What are GCP firewall rules?",
        a: "Controls traffic in VPC. Applied to all instances/services. Ingress/egress rules. Source/destination IPs, protocols, ports. Implicit deny inbound.",
      },
      {
        q: "Explain Cloud Armor.",
        a: "DDoS protection, WAF for GCP. Policies: allow/deny by IP, geo-location, rate limiting. Applied to load balancers. Protection against Layer 3/4/7 attacks.",
      },
      {
        q: "What is GCP Cloud Load Balancing?",
        a: "Global load balancing. HTTP(S), SSL Proxy, TCP Proxy, UDP load balancers. Regional, internal options. Anycast IPs for global distribution.",
      },
      {
        q: "Explain GCP Interconnect.",
        a: "Dedicated connection to GCP. Similar to Azure ExpressRoute, AWS Direct Connect. Higher bandwidth, lower latency than internet.",
      },
      {
        q: "What is GCP Cloud VPN?",
        a: "VPN connectivity to VPC. Site-to-site, on-premises to GCP. IKEv1 or IKEv2. Encrypted tunnel over internet.",
      },
      {
        q: "Explain GCP VPC Peering.",
        a: "Connects GCP VPCs. No bandwidth charges. Cross-project, cross-region support. Non-transitive.",
      },
      {
        q: "What is GCP Shared VPC?",
        a: "Centrally controlled VPC shared by multiple projects. Reduces management overhead. Cross-project resource communication. Centralized security policies.",
      },
      {
        q: "Explain GCP Cloud Router.",
        a: "Manages routes dynamically. BGP routing. Connects on-premises via VPN/Interconnect. Automatic route propagation.",
      },
      {
        q: "What is GCP Cloud CDN?",
        a: "Google's CDN service. Integrates with Cloud Load Balancing. Caches at edge locations. Automatic cache invalidation.",
      },
      {
        q: "Explain GCP Cloud Armor policies.",
        a: "Security policies for L7 load balancer. Allows/denies traffic by IP, geo-location. Rate limiting, bot management. DDoS protection.",
      },
      {
        q: "What is GCP Network Intelligence Center?",
        a: "Monitoring, troubleshooting for VPC. Connectivity tests, metrics. Identifies configuration issues, unused resources.",
      },
      {
        q: "Explain GCP VPC Flow Logs.",
        a: "Records IP traffic in VPC. Subnet or flow-based. Sent to Cloud Logging, BigQuery. Troubleshooting, security analysis.",
      },
      {
        q: "What is GCP Service Directory?",
        a: "Centralized service registry and discovery. Services publish, discover endpoints. DNS integration. Microservices support.",
      },
      {
        q: "Explain GCP Private Google Access.",
        a: "VMs access Google APIs privately. No public IPs needed. Enables secure API calls within VPC.",
      },
      {
        q: "What is GCP Packet Mirroring?",
        a: "Copies traffic for analysis. Mirrors from subnets/instances to destination. IDS/IPS integration. Packet inspection without inline tools.",
      },
      {
        q: "Explain GCP VPC Service Controls.",
        a: "Security perimeters for GCP services. Restricts data access. Prevents data exfiltration. Integration with IAM.",
      },
      {
        q: "What is GCP Hybrid Connectivity?",
        a: "Connects on-premises to GCP. Options: Cloud VPN, Interconnect, Partners. Enables hybrid cloud, migration.",
      },
      {
        q: "Explain GCP Traffic Director.",
        a: "Global load balancer for gRPC. Distributes gRPC traffic. Advanced routing policies. Used for microservices.",
      },
    ],
  },
  {
    id: "troubleshooting",
    name: "Network Troubleshooting",
    icon: "🔧",
    color: "#a78bfa",
    questions: [
      {
        q: "Explain ping and its use cases.",
        a: "Sends ICMP echo requests. Tests connectivity, latency. Response time indicates path delay. 'destination unreachable' indicates network/device issue.",
      },
      {
        q: "What does traceroute/tracert do?",
        a: "Maps path to destination. Increments TTL, each hop responds. Shows intermediate hops, latency per hop. Identifies where connection fails.",
      },
      {
        q: "Explain netstat command.",
        a: "Network statistics. Shows connections, listening ports, statistics. -a: all, -n: numeric, -t: TCP, -u: UDP. Useful for port checking, debugging.",
      },
      {
        q: "What is telnet used for?",
        a: "Tests TCP connectivity on specific port. Deprecated security-wise but useful for testing. telnet destination port. Unencrypted, plaintext protocol.",
      },
      {
        q: "Explain nslookup and dig.",
        a: "DNS lookup tools. Query DNS records, see responses. dig more detailed than nslookup. Troubleshoot DNS resolution issues.",
      },
      {
        q: "What is ipconfig/ifconfig?",
        a: "Displays IP configuration. Windows (ipconfig), Linux/Mac (ifconfig). Shows IP, MAC, subnet, gateway. /all for detailed info.",
      },
      {
        q: "Explain arp command.",
        a: "Queries ARP table. arp -a: show all. arp -d: delete entry. Troubleshoot MAC address resolution, detect ARP spoofing.",
      },
      {
        q: "What is route command?",
        a: "Displays/modifies routing table. route print: show routes. route add/delete: modify routes. Useful for static route troubleshooting.",
      },
      {
        q: "Explain tcpdump/Wireshark.",
        a: "Packet capture tools. tcpdump: command-line (Linux). Wireshark: GUI. Analyzes network traffic, identifies issues, protocol analysis.",
      },
      {
        q: "What is MTU discovery?",
        a: "Path MTU Discovery (PMTUD): finds largest packet size on path. ICMP 'too large' messages. Prevents fragmentation, improves performance.",
      },
      {
        q: "Explain packet loss diagnosis.",
        a: "Use ping, traceroute, packet captures. Identify hop losing packets. Check interface errors, buffer issues. Test with different packet sizes.",
      },
      {
        q: "What are interface statistics?",
        a: "Input/output packets, errors, drops, collisions. Indicates link health. Rising errors suggest hardware issues, protocol problems.",
      },
      {
        q: "Explain duplex mismatch.",
        a: "One end half-duplex, other full-duplex. Causes packet drops, late collisions. Autonegotiation failures. Fix: force matching duplex.",
      },
      {
        q: "What is latency vs jitter?",
        a: "Latency: time for packet to travel. Jitter: variation in latency. High latency: slow. High jitter: voice/video quality issues.",
      },
      {
        q: "Explain bandwidth testing.",
        a: "Tools: iperf, speedtest. Measure throughput. Identifies bottlenecks, suboptimal configurations. Test off-peak for baseline.",
      },
      {
        q: "What is Cisco show commands?",
        a: "show interfaces: physical/logical interfaces. show ip route: routing table. show access-lists: ACL info. show spanning-tree: STP state.",
      },
      {
        q: "Explain debug commands.",
        a: "Enable debugging for protocols. Generates verbose logs. Impacts performance, avoid in production. Useful in lab for troubleshooting.",
      },
      {
        q: "What is syslog?",
        a: "Centralized logging. Devices send logs to syslog server. Severity levels, facility codes. Useful for troubleshooting across network.",
      },
      {
        q: "Explain SNMP monitoring.",
        a: "Simple Network Management Protocol. Polls devices for statistics. MIBs (Management Information Bases) define data. OIDs (Object Identifiers) for specific metrics.",
      },
      {
        q: "What are common ping responses?",
        a: "'Reply from': success. 'Destination host unreachable': no route/host down. 'Request timed out': no response. 'No buffer space available': congestion.",
      },
    ],
  },
  {
    id: "protocols-advanced",
    name: "Advanced Protocols & Concepts",
    icon: "⚙️",
    color: "#f59e0b",
    questions: [
      {
        q: "Explain MPLS (Multiprotocol Label Switching).",
        a: "Forwards packets based on labels, not IP lookup. Simplifies QoS, traffic engineering. Label Switching Path (LSP) from ingress to egress. Used by ISPs.",
      },
      {
        q: "What is QoS (Quality of Service)?",
        a: "Prioritizes traffic based on class. Classifying, marking, queuing. Ensures critical traffic priority. Improves VoIP, video streaming quality.",
      },
      {
        q: "Explain DSCP (Differentiated Services Code Point).",
        a: "Marks packets for QoS treatment. 6-bit field in IP header. EF (expedited forwarding), AF (assured forwarding), CS (class selector).",
      },
      {
        q: "What is traffic shaping?",
        a: "Controls outbound traffic rate. Smooths bursty traffic. Reduces congestion downstream. Implemented with token bucket, leaky bucket algorithms.",
      },
      {
        q: "Explain traffic policing.",
        a: "Enforces rate limit. Exceeds policy: drop or mark packets. Different from shaping: doesn't smooth, just enforces limit.",
      },
      {
        q: "What is congestion avoidance?",
        a: "Prevents queue overflow. RED (Random Early Detection): drops/marks packets before full. Prevents tail drop, TCP global synchronization.",
      },
      {
        q: "Explain reordering in networks.",
        a: "Packets arriving out of order. ECMP load balancing, packet loss. TCP handles reordering, applications may break.",
      },
      {
        q: "What is packet marking?",
        a: "Sets QoS bits: DSCP, CoS. Downstream routers honor marks for differentiated treatment. Enables service classes.",
      },
      {
        q: "Explain VRRP (Virtual Router Redundancy Protocol).",
        a: "Redundancy for routers. Multiple routers, one virtual. Active/standby. Failover on active failure. Similar to HSRP (Cisco proprietary).",
      },
      {
        q: "What is LACP (Link Aggregation Control Protocol)?",
        a: "Bundles multiple links into single logical link. Load balancing across bundle. Detects failed links. Increases bandwidth, redundancy.",
      },
      {
        q: "Explain LLDP (Link Layer Discovery Protocol).",
        a: "Discovers neighboring devices. Sends/receives frames with device info. Used by network management tools. Port/interface discovery.",
      },
      {
        q: "What is SNMP trap?",
        a: "Unsolicited alert from device. Indicates problem/event. Trap receiver listens on port 162. Enables reactive monitoring.",
      },
      {
        q: "Explain sFlow/NetFlow.",
        a: "Flow monitoring technologies. Records traffic flows. Sent to collector for analysis. Identifies traffic patterns, DDoS detection.",
      },
      {
        q: "What is GRE (Generic Routing Encapsulation)?",
        a: "Tunneling protocol. Encapsulates packets in GRE header. Non-encrypted, used with IPsec. Enables multicast tunneling.",
      },
      {
        q: "Explain L2TP (Layer 2 Tunneling Protocol).",
        a: "VPN protocol for remote access. Establishes tunnels. Often with IPsec for encryption (L2TP/IPsec). User authentication.",
      },
      {
        q: "What is PPTP (Point-to-Point Tunneling Protocol)?",
        a: "Legacy VPN protocol. Encrypts PPP frames. Security vulnerabilities discovered, deprecated. Not recommended for new deployments.",
      },
      {
        q: "Explain RADIUS.",
        a: "Remote Authentication Dial-In User Service. Central authentication server. Used for VPN, Wi-Fi authentication. UDP-based.",
      },
      {
        q: "What is TACACS+?",
        a: "Terminal Access Controller Access-Control System Plus. Authentication, authorization, accounting (AAA). Cisco protocol. Better encryption than RADIUS.",
      },
      {
        q: "Explain Kerberos.",
        a: "Ticketing authentication system. Central KDC (Key Distribution Center). User obtains ticket, proves identity. Domain authentication.",
      },
      {
        q: "What is LDAP (Lightweight Directory Access Protocol)?",
        a: "Directory service protocol. Centralized user database. Authentication, authorization. Used in enterprises (Active Directory).",
      },
    ],
  },
  {
    id: "cisco-equipment",
    name: "Cisco Equipment & Commands",
    icon: "🔵",
    color: "#00bceb",
    questions: [
      {
        q: "What are Cisco router interfaces?",
        a: "Serial interfaces: WAN connections. Ethernet: LAN. FastEthernet, GigabitEthernet. Configure IP address, subnet, shutdown state.",
      },
      {
        q: "Explain Cisco configuration modes.",
        a: "User EXEC: limited commands (>). Privileged EXEC: full access (#). Global config: network configuration (config)#. Interface config: per-interface settings (config-if)#.",
      },
      {
        q: "What is Cisco command 'show version'?",
        a: "Displays device info: model, IOS version, uptime, memory. Useful for inventory, troubleshooting.",
      },
      {
        q: "Explain 'show ip interface brief'.",
        a: "Displays all interfaces with status. IP address, protocol status. Quickly see interface health.",
      },
      {
        q: "What is 'show running-config'?",
        a: "Displays current (running) configuration in RAM. Active settings. Changes here until reload.",
      },
      {
        q: "Explain 'show startup-config'.",
        a: "Displays configuration loaded from NVRAM on boot. Persistent config. Differs from running if changes not saved.",
      },
      {
        q: "What does 'copy running-config startup-config' do?",
        a: "Saves running configuration to NVRAM. Persistent across reload. Essential after making changes.",
      },
      {
        q: "Explain Cisco ACL syntax.",
        a: "access-list <number> <permit|deny> <protocol> <source> <destination>. Standard: 1-99. Extended: 100-199. Numbered or named.",
      },
      {
        q: "What is 'show access-lists'?",
        a: "Displays all ACLs and rules. Shows hit count per rule. Useful for debugging ACL logic.",
      },
      {
        q: "Explain 'debug ip packet'.",
        a: "Enables packet debugging. Shows packets processed. Impact on CPU. Disable with 'undebug all'.",
      },
      {
        q: "What is Cisco 'enable' command?",
        a: "Enters privileged EXEC mode. Requires enable password. Allows all commands.",
      },
      {
        q: "Explain 'configure terminal'.",
        a: "Enters global configuration mode. Required for configuration changes. Exit with 'exit' or Ctrl-Z.",
      },
      {
        q: "What is 'shutdown' command?",
        a: "Disables interface/service. Brings interface down. 'no shutdown' enables.",
      },
      {
        q: "Explain 'show ip route'.",
        a: "Displays routing table. Routes, next-hop, metric, administrative distance. Shows all known routes.",
      },
      {
        q: "What is 'ip route' command?",
        a: "Static route configuration. 'ip route <destination> <mask> <gateway>'. Manually specifies routes.",
      },
      {
        q: "Explain 'show spanning-tree'.",
        a: "Displays STP info. Root bridge, bridge IDs, port states, timers. Useful for STP troubleshooting.",
      },
      {
        q: "What is 'show vlan'?",
        a: "Displays all VLANs. VLAN ID, name, ports. Useful for VLAN inventory.",
      },
      {
        q: "Explain VLAN configuration.",
        a: "vlan <id> creates VLAN. name <name> labels it. interface vlan <id> creates SVI. Configure IP for inter-VLAN routing.",
      },
      {
        q: "What is 'show mac address-table'?",
        a: "Displays MAC address table. MAC, VLAN, port, type (dynamic/static). Useful for troubleshooting connectivity.",
      },
      {
        q: "Explain 'clear mac address-table'.",
        a: "Clears learned MAC addresses. Useful for testing, removing stale entries. Rebuilds by learning.",
      },
    ],
  },
  {
    id: "enterprise-design",
    name: "Enterprise Network Design",
    icon: "🏢",
    color: "#8b5cf6",
    questions: [
      {
        q: "Explain hierarchical network model.",
        a: "Three layers: Core (backbone), Distribution (policies), Access (endpoints). Simplifies design, management. Modular, scales easily.",
      },
      {
        q: "What is network redundancy?",
        a: "Multiple paths, devices to avoid single point of failure. Enables failover. Costs more but improves availability.",
      },
      {
        q: "Explain IP address management (IPAM).",
        a: "Central management of IP addresses. DHCP/DNS integration. Prevents conflicts, tracks usage. Tools like Infoblox.",
      },
      {
        q: "What is DNS hierarchy?",
        a: "Root nameservers → TLD nameservers → authoritative nameservers. Recursive resolution: resolver queries hierarchy. Distributed, resilient.",
      },
      {
        q: "Explain high availability (HA) architecture.",
        a: "No single point of failure. Redundant components, fast failover. Achieves uptime SLA (99.99%). Cost-benefit analysis needed.",
      },
      {
        q: "What is disaster recovery (DR)?",
        a: "Plan for recovery from catastrophic failures. RTO: recovery time objective. RPO: recovery point objective. Regular testing essential.",
      },
      {
        q: "Explain network capacity planning.",
        a: "Forecasts growth, identifies bottlenecks. Monitors utilization trends. Plans upgrades, costs. 70-80% utilization threshold.",
      },
      {
        q: "What is network baseline?",
        a: "Establishes normal performance metrics. Used for comparison detecting anomalies. Baseline includes latency, bandwidth, packet loss.",
      },
      {
        q: "Explain network monitoring.",
        a: "Continuous measurement of network health. Monitors: availability, performance, security. Alerts on issues. Tools: SNMP, NetFlow.",
      },
      {
        q: "What is change management?",
        a: "Formal process for network changes. Documentation, testing, approval. Rollback plan. Prevents unplanned outages.",
      },
      {
        q: "Explain network segmentation.",
        a: "Divides network into isolated segments. Improves security, performance. Limits breach impact. VLANs, firewalls implement segmentation.",
      },
      {
        q: "What is DMZ design?",
        a: "Demilitarized zone for public servers. Between outside firewall + inside. Compromised DMZ isolated from inside. Multi-zone recommended.",
      },
      {
        q: "Explain zero-trust architecture.",
        a: "Never trust, always verify. All traffic authenticated, encrypted. Micro-segmentation. Reduces compromise impact.",
      },
      {
        q: "What is defense in depth?",
        a: "Multiple security layers. Firewall, IDS, VPN, endpoint security. No single failure compromises security. Redundancy.",
      },
      {
        q: "Explain network documentation.",
        a: "Diagrams, configs, procedures. Assists troubleshooting, changes, onboarding. Tools: Visio, Lucidchart. Keep updated.",
      },
      {
        q: "What is network topology?",
        a: "Physical layout of devices, connections. Logical layout of addresses, routes. Documentation essential.",
      },
      {
        q: "Explain network scalability.",
        a: "Network grows without major redesign. Hierarchical design, modular. IP address planning, summarization.",
      },
      {
        q: "What is network convergence?",
        a: "All devices have consistent view after change. Fast convergence reduces packet loss. Routing protocol feature.",
      },
      {
        q: "Explain network migration.",
        a: "Moving from old to new network. Requires planning, testing. Phased approach reduces risk. Rollback plan essential.",
      },
      {
        q: "What is network compliance?",
        a: "Adhering to standards: PCI, HIPAA, SOC2. Security requirements, audit trails. Improves security posture, legal protection.",
      },
    ],
  },
];

export default function NetworkingInterviewQuestions() {
  const [selectedCategory, setSelectedCategory] = useState(NETWORKING_CATEGORIES[0].id);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [statsVisible, setStatsVisible] = useState(false);

  const category = NETWORKING_CATEGORIES.find((c) => c.id === selectedCategory);
  const filteredQuestions = category.questions.filter(
    (q) =>
      q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalQuestions = NETWORKING_CATEGORIES.reduce((sum, cat) => sum + cat.questions.length, 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1a0f2e 100%)",
        color: "#e2e8f0",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "28px 32px",
          borderBottom: "1px solid #1e2535",
          background: "rgba(10, 14, 23, 0.5)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <span style={{ fontSize: "32px" }}>🌐</span>
            <div>
              <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 700 }}>Network Engineer Interview Prep</h1>
              <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: "14px" }}>
                {totalQuestions}+ detailed networking questions • {NETWORKING_CATEGORIES.length} categories
              </p>
            </div>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search by keyword or topic..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setExpandedIndex(null);
            }}
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "#141824",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#e2e8f0",
              fontSize: "14px",
              outline: "none",
              transition: "all 0.2s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#00d4ff";
              e.target.style.background = "#0f172a";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#334155";
              e.target.style.background = "#141824";
            }}
          />
        </div>
      </div>

      {/* Main */}
      <div style={{ display: "flex", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Categories sidebar */}
        <div
          style={{
            width: "260px",
            borderRight: "1px solid #1e2535",
            padding: "20px 12px",
            overflowY: "auto",
            maxHeight: "calc(100vh - 120px)",
          }}
        >
          {NETWORKING_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSearchTerm("");
                setExpandedIndex(null);
              }}
              style={{
                width: "100%",
                padding: "12px 14px",
                marginBottom: "8px",
                background: selectedCategory === cat.id ? "#1a2236" : "transparent",
                border: `1px solid ${selectedCategory === cat.id ? cat.color + "44" : "transparent"}`,
                borderLeft: selectedCategory === cat.id ? `3px solid ${cat.color}` : "3px solid transparent",
                borderRadius: "6px",
                color: selectedCategory === cat.id ? "#f1f5f9" : "#94a3b8",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "13px",
                fontWeight: 600,
                transition: "all 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "16px" }}>{cat.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {cat.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                    {cat.questions.length}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Questions */}
        <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto", maxHeight: "calc(100vh - 120px)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "24px" }}>{category.icon}</span>
              <div>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>{category.name}</h2>
                <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: "13px" }}>
                  {filteredQuestions.length} of {category.questions.length} questions
                  {searchTerm && ` (filtered)`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setStatsVisible(!statsVisible)}
              style={{
                padding: "8px 12px",
                background: "#1a2236",
                border: "1px solid #334155",
                borderRadius: "6px",
                color: "#94a3b8",
                cursor: "pointer",
                fontSize: "12px",
                transition: "all 0.2s",
              }}
            >
              {statsVisible ? "Hide" : "Show"} Stats
            </button>
          </div>

          {statsVisible && (
            <div
              style={{
                padding: "16px 20px",
                background: "#0f172a",
                border: "1px solid #1e3a5f",
                borderRadius: "8px",
                marginBottom: "20px",
                fontSize: "13px",
              }}
            >
              <div style={{ color: "#94a3b8", lineHeight: "1.8" }}>
                <div>📊 <strong>Total Categories:</strong> {NETWORKING_CATEGORIES.length}</div>
                <div>📋 <strong>Total Questions:</strong> {totalQuestions}+</div>
                <div>🔍 <strong>Current Category:</strong> {category.questions.length} questions</div>
                <div>✅ <strong>Topics Covered:</strong> Fundamentals, Routing, Switching, Firewall, VPN, Cloud (AWS/Azure/GCP), Troubleshooting</div>
              </div>
            </div>
          )}

          {filteredQuestions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
              <p style={{ margin: 0, fontSize: "16px" }}>No questions match your search.</p>
            </div>
          ) : (
            filteredQuestions.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                style={{
                  background: expandedIndex === idx ? "#1a2236" : "#141824",
                  border: `1px solid ${expandedIndex === idx ? "#334155" : "#1e2535"}`,
                  borderRadius: "8px",
                  marginBottom: "12px",
                  overflow: "hidden",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
              >
                {/* Question */}
                <div
                  style={{
                    padding: "16px 18px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: category.color + "22",
                      border: `1px solid ${category.color}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: category.color,
                      flexShrink: 0,
                    }}
                  >
                    Q
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#e2e8f0",
                        lineHeight: "1.5",
                      }}
                    >
                      {item.q}
                    </p>
                  </div>
                  <span style={{ color: "#475569", fontSize: "16px", flexShrink: 0 }}>
                    {expandedIndex === idx ? "▲" : "▼"}
                  </span>
                </div>

                {/* Answer */}
                {expandedIndex === idx && (
                  <div
                    style={{
                      borderTop: "1px solid #1e2535",
                      padding: "16px 18px",
                      background: "#0f172a",
                      display: "flex",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: "#69db7c22",
                        border: "1px solid #69db7c",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#69db7c",
                        flexShrink: 0,
                      }}
                    >
                      A
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        color: "#cbd5e1",
                        lineHeight: "1.7",
                      }}
                    >
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
