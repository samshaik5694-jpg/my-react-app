import { useState } from "react";

const VENDOR_INTERVIEW_CATEGORIES = [
  {
    id: "routing",
    name: "Routing Scenarios (77+ Q&A)",
    icon: "🌐",
    color: "#3b82f6",
    questions: [
      { q: "Configure OSPF with multi-area design", a: `**OSPF Multi-Area Design Interview Question:**

**Question:** "Design and configure an OSPF network for a large enterprise with multiple buildings. Explain your area design choices and implement the configuration."

**Detailed Answer:**

**Understanding OSPF Areas:**
OSPF uses a hierarchical design with areas to improve scalability and reduce routing table size. Area 0 (backbone) is mandatory and connects all other areas. Non-backbone areas (stub, totally stubby, NSSA) reduce LSA flooding and improve convergence.

**Design Considerations:**
- **Area 0 (Backbone):** All inter-area traffic flows through Area 0
- **Stub Areas:** Block external routes (Type 5 LSAs), ABR injects default route
- **Totally Stubby Areas:** Block external and inter-area routes, only default route from ABR
- **NSSA Areas:** Allow ASBRs while blocking external routes from other areas

**Real-World Scenario:**
A company has headquarters (Area 0) with two branch offices (Area 1 and Area 2). Area 1 is a remote office with limited bandwidth, so we make it totally stubby to minimize routing updates.

**Step-by-Step Configuration:**

**1. Configure OSPF Process and Router ID:**
\`\`\`
Router(config)# router ospf 1
Router(config-router)# router-id 10.1.1.1
Router(config-router)# log-adjacency-changes
\`\`\`

**2. Configure Backbone Area (Area 0):**
\`\`\`
Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip address 192.168.1.1 255.255.255.0
Router(config-if)# ip ospf 1 area 0
Router(config-if)# no shutdown
\`\`\`

**3. Configure Branch Area (Area 1) as Totally Stubby:**
\`\`\`
Router(config)# interface GigabitEthernet0/1
Router(config-if)# ip address 10.1.1.1 255.255.255.0
Router(config-if)# ip ospf 1 area 1
Router(config-if)# no shutdown

Router(config)# router ospf 1
Router(config-router)# area 1 stub no-summary
\`\`\`

**4. Configure Passive Interfaces:**
\`\`\`
Router(config)# router ospf 1
Router(config-router)# passive-interface default
Router(config-router)# no passive-interface GigabitEthernet0/0
\`\`\`

**Verification Commands:**
\`\`\`
show ip ospf neighbor
show ip ospf database
show ip ospf interface brief
show ip route ospf
\`\`\`

**Troubleshooting Common Issues:**
- **Neighbor Adjacency Problems:** Check MTU, authentication, network type
- **Area Mismatch:** Ensure all routers in same area agree on area type
- **DR Election Issues:** Check router priorities and interface states

**Best Practices:**
- Use loopback interfaces for stable router IDs
- Implement area summarization to reduce LSA flooding
- Use totally stubby areas for branch offices
- Monitor OSPF database size and convergence times` },
      { q: "Troubleshoot BGP adjacency", a: `**BGP Adjacency Troubleshooting Interview Question:**

**Question:** "A BGP peering session between your router and an ISP is not establishing. Walk me through your systematic troubleshooting approach and resolution steps."

**Detailed Answer:**

**Understanding BGP Neighbor States:**
BGP goes through several states during session establishment:
- **Idle:** Initial state, waiting for start event
- **Connect:** TCP connection being established
- **Active:** TCP connection failed, listening for connection
- **OpenSent:** Open message sent, waiting for reply
- **OpenConfirm:** Open message received, waiting for keepalive
- **Established:** Session fully established, exchanging routes

**Common BGP Adjacency Issues:**
1. **TCP Connectivity Problems** (most common)
2. **AS Number Mismatch**
3. **Authentication Failures**
4. **TTL Security Issues**
5. **MTU Mismatch**
6. **Interface or Routing Problems**

**Real-World Scenario:**
Your company's edge router is trying to peer with ISP router 192.168.1.2. The session shows "Idle" state. Users report intermittent connectivity loss to internet resources.

**Systematic Troubleshooting Process:**

**Step 1: Check BGP Session Status**
\`\`\`
Router# show ip bgp summary
BGP router identifier 10.1.1.1, local AS number 65001
BGP table version is 1, main routing table version 1

Neighbor        V    AS MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd
192.168.1.2     4 65002       0       0        0    0    0 never    Idle
\`\`\`

**Step 2: Verify IP Connectivity**
\`\`\`
Router# ping 192.168.1.2 source 192.168.1.1
Router# traceroute 192.168.1.2 source 192.168.1.1
Router# show ip route 192.168.1.2
\`\`\`

**Step 3: Check BGP Neighbor Configuration**
\`\`\`
Router# show running-config | section router bgp
router bgp 65001
 neighbor 192.168.1.2 remote-as 65002
 neighbor 192.168.1.2 password MySecretPassword
 neighbor 192.168.1.2 update-source Loopback0
 neighbor 192.168.1.2 ebgp-multihop 2
\`\`\`

**Step 4: Enable BGP Debugging**
\`\`\`
Router# debug ip bgp
Router# debug ip tcp transactions
Router# terminal monitor
\`\`\`

**Step 5: Common Resolution Steps**

**Issue: TCP Connection Failure**
\`\`\`
! Check if neighbor IP is reachable
Router# show ip route 192.168.1.2

! Verify interface status
Router# show interfaces GigabitEthernet0/0 | include line protocol

! Check for ACL blocking BGP (TCP 179)
Router# show ip interface GigabitEthernet0/0 | include access
\`\`\`

**Issue: AS Number Mismatch**
\`\`\`
! Verify remote AS number
Router# show running-config | include remote-as

! ISP confirms their AS number - update if wrong
Router(config)# router bgp 65001
Router(config-router)# neighbor 192.168.1.2 remote-as 65002
\`\`\`

**Issue: Authentication Problems**
\`\`\`
! Check if passwords match
Router# show running-config | include password

! Remove and re-add password
Router(config)# router bgp 65001
Router(config-router)# no neighbor 192.168.1.2 password
Router(config-router)# neighbor 192.168.1.2 password NewSecurePassword
\`\`\`

**Step 6: Verify After Resolution**
\`\`\`
Router# show ip bgp summary
Router# show ip bgp neighbors 192.168.1.2
Router# show ip route bgp
\`\`\`

**Advanced BGP Troubleshooting:**
- **TTL Issues:** Use \`ebgp-multihop\` for non-directly connected peers
- **Route-Map Problems:** Check for inbound route filtering
- **BGP Scanner Issues:** Monitor CPU usage during route processing
- **Memory Problems:** Check for BGP table size limits

**Prevention Best Practices:**
- Use loopback interfaces for BGP peering stability
- Implement MD5 authentication on all eBGP sessions
- Configure BGP route dampening to prevent route flaps
- Monitor BGP session state with SNMP traps
- Document all peering agreements and parameters` },
      { q: "Configure route filtering", a: `**Route Filtering Interview Question:**

**Question:** "Your company receives a full BGP routing table from the ISP, but you only want to accept routes for your organization's public IP space and major internet destinations. How would you implement route filtering to control what routes enter your network?"

**Detailed Answer:**

**Understanding Route Filtering Concepts:**
Route filtering controls which routes are accepted, advertised, or redistributed between routing protocols. This prevents unwanted routes from entering your network, reduces routing table size, and improves security and performance.

**Types of Route Filters:**
- **Prefix Lists:** Filter based on IP address ranges and subnet masks
- **Route Maps:** Complex filtering with multiple conditions and actions
- **Access Lists:** Simple IP-based filtering (legacy)
- **AS Path Filters:** Filter based on BGP AS path attributes
- **Community Filters:** Filter based on BGP community values

**Real-World Scenario:**
Your enterprise has public IP space 203.0.113.0/24 and wants to accept only routes for major internet destinations (default route, major ISP routes) plus your own IP space from the ISP's BGP feed.

**Implementation Strategy:**

**Step 1: Analyze Current Routing Table**
\`\`\`
Router# show ip route summary
Router# show ip bgp summary
Router# show ip bgp neighbors 192.168.1.2 routes | head 20
\`\`\`

**Step 2: Create Prefix List for Allowed Routes**
\`\`\`
! Define allowed prefixes
Router(config)# ip prefix-list ENTERPRISE_ROUTES permit 203.0.113.0/24
Router(config)# ip prefix-list ENTERPRISE_ROUTES permit 203.0.113.0/24 le 32

! Allow major internet routes (simplified example)
Router(config)# ip prefix-list ENTERPRISE_ROUTES permit 8.8.0.0/16 le 24
Router(config)# ip prefix-list ENTERPRISE_ROUTES permit 4.0.0.0/8 le 16

! Default route
Router(config)# ip prefix-list ENTERPRISE_ROUTES permit 0.0.0.0/0

! Deny everything else
Router(config)# ip prefix-list ENTERPRISE_ROUTES deny 0.0.0.0/0 le 32
\`\`\`

**Step 3: Create AS Path Filter (Optional)**
\`\`\`
! Only accept routes from your ISP's AS
Router(config)# ip as-path access-list 10 permit ^65002$
Router(config)# ip as-path access-list 10 permit ^65002_[0-9]*$

! Deny routes with private AS numbers in path
Router(config)# ip as-path access-list 10 deny _64512_
Router(config)# ip as-path access-list 10 deny _65535_
\`\`\`

**Step 4: Create Route Map Combining Filters**
\`\`\`
! Create comprehensive route map
Router(config)# route-map BGP_INBOUND_FILTER permit 10
Router(config-route-map)# match ip address prefix-list ENTERPRISE_ROUTES
Router(config-route-map)# match as-path 10
Router(config-route-map)# set local-preference 200
Router(config-route-map)# set community 65001:100

Router(config)# route-map BGP_INBOUND_FILTER permit 20
Router(config-route-map)# match ip address prefix-list DEFAULT_ROUTE
Router(config-route-map)# set local-preference 50

Router(config)# route-map BGP_INBOUND_FILTER deny 30
\`\`\`

**Step 5: Apply Filter to BGP Neighbor**
\`\`\`
Router(config)# router bgp 65001
Router(config-router)# neighbor 192.168.1.2 route-map BGP_INBOUND_FILTER in
Router(config-router)# neighbor 192.168.1.2 prefix-list ENTERPRISE_ROUTES in
\`\`\`

**Step 6: Verification and Testing**
\`\`\`
! Check what routes are being received
Router# show ip bgp neighbors 192.168.1.2 routes | include 203.0.113

! Verify route map application
Router# show route-map BGP_INBOUND_FILTER

! Check BGP table size reduction
Router# show ip bgp summary
Router# show ip route summary

! Test specific route acceptance
Router# show ip bgp regexp ^65002$
\`\`\`

**Common Filtering Issues and Solutions:**

**Issue: Routes Still Appearing**
\`\`\`
! Check filter direction (in vs out)
Router# show running-config | include route-map.*in

! Verify prefix list syntax
Router# show ip prefix-list ENTERPRISE_ROUTES
\`\`\`

**Issue: Too Restrictive Filtering**
\`\`\`
! Add more specific permits
Router(config)# ip prefix-list ENTERPRISE_ROUTES permit 192.0.2.0/24

! Use ge/le for more flexibility
Router(config)# ip prefix-list ENTERPRISE_ROUTES permit 198.51.100.0/24 ge 25 le 28
\`\`\`

**Advanced Filtering Techniques:**
- **Community-Based Filtering:** Use BGP communities to tag and filter routes
- **Local Preference Manipulation:** Set different preferences for different route types
- **BGP Soft Reset:** Apply filter changes without resetting BGP session
- **Regular Expression Filters:** Complex AS path pattern matching

**Best Practices:**
- Test filters in lab environment first
- Use soft reconfiguration inbound to avoid session resets
- Document all filter rules and their purposes
- Monitor for legitimate routes being filtered accidentally
- Regularly review and update filter lists as network grows
- Implement logging for filtered routes` },
      { q: "Implement EIGRP load balancing", a: `**Real Scenario:** Enterprise WAN with multiple links to headquarters. Need to utilize all available bandwidth while maintaining redundancy.

**EIGRP Load Balancing Configuration:**

**1. Equal Cost Load Balancing (Default):**
\`\`\`
router eigrp 100
 network 10.0.0.0 0.255.255.255
 network 192.168.1.0 0.0.0.255
 maximum-paths 6  ! Default is 4, max is 32
 variance 1       ! Must be 1 for equal cost
 no auto-summary
\`\`\`

**2. Unequal Cost Load Balancing:**
\`\`\`
! Check current topology
show ip eigrp topology

! Configure variance (multiplier for feasible successor metric)
router eigrp 100
 variance 2  ! Accept routes up to 2x worse than best path
 maximum-paths 6

! Example topology output:
P 10.0.0.0/24, 1 successors, FD is 281600
         via 192.168.1.2 (281600/128256), Serial0/0
         via 192.168.2.2 (307200/128256), Serial0/1  ! Feasible successor
\`\`\`

**3. Interface Configuration:**
\`\`\`
interface Serial0/0
 bandwidth 1544  ! T1 line
 delay 20000     ! 20,000 microseconds
 no ip split-horizon eigrp 100

interface Serial0/1
 bandwidth 512   ! 512K line
 delay 20000
 no ip split-horizon eigrp 100
\`\`\`

**4. Traffic Engineering with Offset Lists:**
\`\`\`
! Increase metric on preferred path to force load distribution
router eigrp 100
 offset-list 0 out 10000 Serial0/0  ! Add 10,000 to metric outbound

! Access list for specific networks
access-list 10 permit 10.1.0.0 0.0.255.255
offset-list 10 out 5000 Serial0/1
\`\`\`

**Verification Commands:**
\`\`\`
show ip eigrp topology
show ip eigrp neighbors
show ip route eigrp
show ip eigrp traffic
show interfaces | include reliability
\`\`\`

**Load Balancing Verification:**
\`\`\`
! Check actual packet distribution
show ip eigrp topology | include successors
show ip route 10.0.0.0  ! Should show multiple next-hops

! Monitor traffic per interface
show interfaces Serial0/0 | include packets output
show interfaces Serial0/1 | include packets output
\`\`\`

**Troubleshooting Load Balancing Issues:**

**Issue: Only one path used despite multiple routes**
\`\`\`
! Check variance setting
show running-config | section router eigrp

! Verify feasible successors exist
show ip eigrp topology | include successors
\`\`\`

**Issue: Uneven load distribution**
\`\`\`
! Check interface metrics
show interfaces | include BW|DLY

! Adjust delay or bandwidth
interface Serial0/1
 delay 25000  ! Increase delay to reduce preference
\`\`\`

**Best Practices:**
- Use variance carefully to avoid routing loops
- Monitor actual traffic distribution, not just route tables
- Consider using PBR for more granular control
- Document load balancing ratios for each destination
- Test failover scenarios regularly` },
      { q: "Configure RIP with split horizon", a: `**Real Scenario:** Small branch office network with legacy equipment requiring RIP for routing. Need to prevent routing loops and optimize convergence.

**Complete RIP Configuration:**

**1. Basic RIP Configuration:**
\`\`\`
router rip
 version 2
 network 10.0.0.0
 network 192.168.1.0
 no auto-summary
 passive-interface default
 no passive-interface GigabitEthernet0/0
 default-information originate
\`\`\`

**2. Interface-Level Configuration:**
\`\`\`
interface GigabitEthernet0/0
 ip address 10.1.1.1 255.255.255.0
 ip rip send version 2
 ip rip receive version 2
 no ip split-horizon  ! Disable on NBMA networks
 no shutdown

interface GigabitEthernet0/1
 ip address 192.168.1.1 255.255.255.0
 ip rip send version 1 2  ! Send both versions
 ip rip receive version 2
 ip split-horizon  ! Enable (default)
\`\`\`

**3. RIP Authentication (Security):**
\`\`\`
! Create key chain
key chain RIP_AUTH
 key 1
  key-string MySecurePassword123
  send-lifetime 00:00:00 Jan 1 2024 23:59:59 Dec 31 2024
  accept-lifetime 00:00:00 Jan 1 2024 23:59:59 Dec 31 2024

! Apply to interface
interface GigabitEthernet0/0
 ip rip authentication mode md5
 ip rip authentication key-chain RIP_AUTH
\`\`\`

**4. Route Filtering and Control:**
\`\`\`
! Filter specific routes
router rip
 distribute-list 10 in GigabitEthernet0/0
 offset-list 20 out 5  ! Add 5 to hop count outbound

! Access lists for filtering
access-list 10 permit 10.0.0.0 0.255.255.255
access-list 10 deny any
access-list 20 permit 192.168.1.0 0.0.0.255
\`\`\`

**5. Timers and Performance Tuning:**
\`\`\`
router rip
 timers basic 30 180 180 240  ! Update, Invalid, Holddown, Flush
 distance 120  ! Administrative distance
 maximum-paths 4  ! Load balancing paths
\`\`\`

**Verification Commands:**
\`\`\`
show ip rip database
show ip route rip
show ip protocols
show ip rip interface
debug ip rip
\`\`\`

**Split Horizon Behavior:**

**Enabled (Default on most interfaces):**
- Prevents routing loops by not advertising routes back on the interface they were learned
- Essential for hub-and-spoke topologies
- Can cause issues in full-mesh Frame Relay

**Disabled (Required for NBMA networks):**
\`\`\`
interface Serial0/0
 encapsulation frame-relay
 no ip split-horizon  ! Required for full mesh
\`\`\`

**Troubleshooting RIP Issues:**

**Issue: Routes not propagating**
\`\`\`
! Check if interface is passive
show ip protocols | include Passive

! Verify network statements
show running-config | section router rip

! Check neighbor relationships
debug ip rip events
\`\`\`

**Issue: Routing loops**
\`\`\`
! Enable split horizon
interface Serial0/0
 ip split-horizon

! Increase holddown timer
router rip
 timers basic 30 180 240 300
\`\`\`

**Best Practices:**
- Use RIP version 2 for classless routing
- Implement authentication on all interfaces
- Use passive-interface on stub links
- Monitor route flapping with logging
- Consider migrating to EIGRP or OSPF for larger networks` },
      { q: "BGP communities setup", a: "set community 65000:100\nroute-map TAG permit 10\nset community additive" },
      { q: "GRE tunnel config", a: "interface Tunnel0\ntunnel source 203.0.113.1\ntunnel destination 203.0.113.2\nno ip redirect" },
      { q: "VRRP primary setup", a: "vrrp 1 ip 10.0.0.1\nvrrp 1 priority 200\nvrrp 1 preempt\nvrrp 1 track 1 decrement 50" },
      { q: "Route summarization OSPF", a: "area 1 range 10.0.0.0 255.255.0.0\narearange suppress-fa" },
      { q: "Static routing with AD", a: "ip route 10.0.0.0 255.255.0.0 10.1.1.1 10\nip route 10.0.0.0 255.255.0.0 10.2.1.1 20" },
      { q: "EIGRP stub routing", a: "router eigrp 100\neigrp stub connected summary\nshow ip eigrp neighbors detail" },
      { q: "BGP failover config", a: "neighbor X.X.X.X local-preference 200\nneighbor Y.Y.Y.Y local-preference 100" },
      { q: "OSPF priority tuning", a: "interface Ethernet0\nip ospf priority 10\nspanning-tree prevents worst path" },
      { q: "RIP best practices", a: "passive-interface default\nno passive-interface eth0\nversion 2\nkey chain authentication" },
      { q: "MPLS basics", a: "mpls ldp router-id 1.1.1.1\ninterface Ethernet0\nmpls ip\nshow mpls ldp neighbor" },
      { q: "BGP reset session", a: "clear ip bgp *\nclear ip bgp 10.0.0.1\nsoft reconfiguration inbound" },
      { q: "Route-map set commands", a: "set metric +10\nset as-path prepend 65000\nset local-preference 300\nset origin igp" },
      { q: "OSPF DR/BDR election", a: "show ip ospf interface\nip ospf priority 255 (DR)\nip ospf priority 0 (never DR)" },
      { q: "BGP local preference", a: "Higher value preferred\nDefault: 100\nUsed within AS only\nAffects outbound traffic" },
      { q: "EIGRP metric calculation", a: "metric 256*(BW+DELAY)\nBW=107/link bandwidth\nDELAY=interface delay\nK values: default K1=1 K3=1" },
      { q: "Configure OSPF authentication", a: "area 0 authentication\ninterface eth0\nip ospf authentication-key pass123\nip ospf authentication message-digest" },
      { q: "BGP attribute preference", a: "1. Weight (local)\n2. Local Preference\n3. AS Path length\n4. Origin\n5. MED" },
      { q: "Static route monitoring", a: "track 1 interface Serial0 line-protocol\nip route 0.0.0.0 0.0.0.0 10.1.1.1\nreliability 100 offset 10" },
      { q: "OSPF cost calculation", a: "Cost = 100000000/bandwidth (Mbps)\nDefault bandwidth for Ethernet: 100Mbps = cost 1000\nManual: ip ospf cost 100" },
      { q: "BGP MED attribute", a: "set metric (MED)\nUsed for inter-AS decisions\nLower is better\nSet via route-map\naffects inbound paths" },
      { q: "EIGRP stuck in active", a: "SIA routes - neighbors not replying\nDebug: show ip eigrp topology\nIncrease K4/K5 timers\nCheck neighbor connectivity" },
      { q: "Route redistribution loops", a: "Set metrics on redistributed routes\nUse route-maps to filter\nTag routes with communities\nMonitor routing table" },
      { q: "BGP confederations", a: "bgp confederation identifier 65000\nbgp confederation peers 65001 65002\nReduces iBGP mesh, improves scalability" },
      { q: "OSPF virtual link", a: "area 1 virtual-link 4.4.4.4\nConnects non-backbone area through transit\nFor ABR routers\nuse case: area split" },
      { q: "RIP version migration", a: "router rip\nversion 2\nno auto-summary\nsend version 2\nreceive version 2" },
      { q: "BGP conditional route", a: "route-map CONDITIONAL permit 10\nmatch ip address prefix INTERNAL\nset local-preference 300\nif condition met, set attr" },
      { q: "EIGRP query range", a: "Stuck in active if no replies\nUse ip summary-address to block queries\nSet variance for load balancing\nReduce topology" },
      { q: "OSPF area filters", a: "area 1 filter-list prefix FILTER in\narea 1 filter-list prefix FILTER out\nControlls route distribution between areas" },
      { q: "Static multicast route", a: "ip mroute 224.0.0.0 240.0.0.0 10.0.0.1\nStatically define multicast path\nUsed when PIM not available" },
      { q: "BGP optimal route", a: "Best path selection: Weight > LocalPref > AS Path > Origin > MED > Type > IGP cost > RID" },
      { q: "OSPF design rules", a: "Hub-and-spoke: one area\nMesh: multiple areas\nMax routers per area: 50-100\nMax areas per ABR: 3-5" },
      { q: "RIP counting to infinity", a: "Hop limit: 15 (16=unreachable)\nSplit horizon prevents\nPoisoned reverse blocks\nHold down timer delays recovery" },
      { q: "BGP route refresh", a: "clear ip bgp soft in/out\nsoft reconfiguration inbound\nDynamic capabilities: BGP refresh" },
      { q: "Configure EIGRP variance", a: "variance 2\nAccepts 2x worse metric\nUsed for unequal load balancing\nDistributes traffic unequally" },
      { q: "OSPF summarization ABR", a: "Configure on ABR\narea 1 range 10.0.0.0 255.255.0.0\narea 1 range 192.168.0.0 255.255.0.0\nReduces LSA flooding" },
      { q: "BGP soft reconfiguration", a: "neighbor 10.0.0.1 soft-reconfiguration inbound\nStores received routes\nAllows clear without reset" },
      { q: "Static route with interface", a: "ip route 10.0.0.0 255.255.0.0 FastEthernet0/0\nip route 10.0.0.0 255.255.0.0 FastEthernet0/0 255.255.255.0" },
      { q: "OSPF DR delay", a: "Wait timer: 40 seconds default\nRouter with highest priority elected\nLoopback IP as tiebreaker\nDR handles LSDB sync" },
      { q: "RIP authentication", a: "key chain RIP\nkey 1\nkey-string MyPassword\ninterface eth0\nip rip authentication mode md5\nip rip authentication key-chain RIP" },
      { q: "BGP next-hop-self", a: "neighbor 10.0.0.1 next-hop-self\nReplaces next hop with local IP\nUsed for iBGP peers\nPrevents routing loops" },
      { q: "EIGRP authentication", a: "key chain EIGRP\nkey 1\nkey-string secret\ninterface eth0\nip authentication mode eigrp 100 md5\nip authentication key-chain eigrp 100 EIGRP" },
      { q: "BGP peer grouping", a: "neighbor PEERS peer-group\nneighbor PEERS remote-as 65001\nneighbor 10.0.0.1 peer-group PEERS\nReduces config, improves scalability" },
      { q: "OSPF area stub", a: "area 1 stub\nArea 3 LSA not flooded\nABR generates default route\nReduces routing table, memory" },
      { q: "Static default route", a: "ip route 0.0.0.0 0.0.0.0 10.1.1.1\nip route 0.0.0.0 0.0.0.0 10.2.1.1 100" },
      { q: "BGP update pacing", a: "bgp dampening\nbgp timers throttle spikes\nPrevent route flap storms\nAdjust holddown times" },
      { q: "EIGRP summarization", a: "ip summary-address eigrp 100 10.0.0.0 255.255.0.0\nReduces topology table\nBlocks queries from summary range\nImproves convergence" },
      { q: "OSPF NSSA area", a: "area 1 nssa\nType 7 LSA for external routes\nABR translates to Type 5\nAllows ASBR in stub area" },
      { q: "RIP poison reverse", a: "Route back to source with metric 16\nPrevents count to infinity\nEnables faster convergence\nDefault enabled" },
      { q: "BGP path hunting", a: "Use AS-path prepending\nSet MED on primary path\nLower local-preference on backup\nControlls inbound traffic" },
      { q: "Configure OSPF graceful restart", a: "Enable OSPF graceful restart for seamless upgrades\nPreserve routes during process restart\nConfigure with 'graceful-restart' command\nHelps maintain BGP sessions during OSPF maintenance" },
      { q: "Implement EIGRP stub routing", a: "Designate stub routers to prevent transit traffic\nReduces route advertisements\nUse 'eigrp stub' command\nUseful for branch offices and access networks" },
      { q: "Design BGP confederations", a: "Reduce iBGP mesh complexity by grouping ASes\nSub-ASes communicate via eBGP\nWorks transparently with external ASes\nTypical for large service providers" },
      { q: "Configure route filtering with distribute-lists", a: "Filter routes inbound/outbound using ACLs or prefix-lists\n'distribute-list IN/OUT' on interfaces\nPrevents unwanted routes from being learned or advertised" },
      { q: "Implement IS-IS routing", a: "ISO Open Systems Interconnection routing\nLink-state protocol similar to OSPF\nPopular in service provider networks\nTwo-level hierarchy: Level 1 and Level 2" },
      { q: "Configure multipath routing", a: "Load balance across equal or unequal cost paths\nOSPF equal cost, EIGRP with variance\nBGP with add-path\nUtilizes redundant links effectively" },
      { q: "Implement route redistribution safely", a: "Prevent routing loops when redistributing between protocols\nUse route tags and distance settings\nApply route-maps to control redistribution" },
      { q: "Configure fast convergence timers", a: "Lower hello/dead intervals for rapid neighbor detection\nImpact CPU usage\nBalance between convergence speed and overhead\nTest before production deployment" },
      { q: "Implement MPLS traffic engineering", a: "Use MPLS to engineer traffic flow paths\nCreate explicit label-switched paths (LSP)\nUseful for QoS and avoiding congestion\nRequires LDP or RSVP-TE" },
      { q: "Configure BGP traffic engineering with MED", a: "Use Multi-Exit Discriminator for inbound traffic control\nLower MED preferred\nApplied per prefix\nCoordinates with neighbor AS for path selection" },
      { q: "Implement segment routing", a: "Simplified MPLS using source-based packet forwarding\nNo need for per-flow state\nWorks with existing IGPs (OSPF, IS-IS)\nReduces operational complexity" },
      { q: "Configure route aggregation strategies", a: "Plan supernet boundaries for summarization\nOSPF summarization at ABRs\nBGP aggregate-address command\nReduces routing table size and update frequency" },
      { q: "Implement BGP route dampening", a: "Suppress flapping routes to improve stability\nParameters: Half-life, reuse, suppress, max-suppress\nPrevents routing oscillation from affecting network" },
      { q: "Configure passive interfaces", a: "Prevent routing protocol traffic on specific interfaces\n'passive-interface default' then enable on needed links\nReduces unnecessary adjacencies" },
      { q: "Implement prefix-independent convergence", a: "Achieve fast convergence for all prefixes simultaneously\nNo per-prefix calculation\nRecent development in routing protocol optimization" },
      { q: "OSPF area border router responsibilities", a: "Connect multiple areas\nFloods LSAs between areas\nSummarizes routes at area boundary\nGenerates Type 3 and Type 4 LSAs\nMaintains two OSPF processes or multi-area" },
      { q: "BGP split horizon rule", a: "Router does not advertise route learned from neighbor back to that neighbor\nPrevents routing loops\nApplied in distance-vector protocols\nBGP uses path vector, not distance-vector" },
      { q: "EIGRP reliable transport protocol", a: "Guarantees ordered delivery of updates\nUses acknowledgments\nRetransmits lost packets\nSeparate reliable and unreliable multicast\nEnsures convergence" },
      { q: "Route flapping causes and effects", a: "Causes: unstable links, equipment failures, config changes\nEffects: CPU/memory spike, route oscillation, traffic loss\nMitigation: BGP dampening, fast hellos, proper MTU settings" },
      { q: "ISIS metric types", a: "Internal metrics for IS-IS routes\nExternal metrics for imported routes\nWide metrics support up to 32 bits\nDefault metric 10 per interface" },
      { q: "BGP ASN usage requirements", a: "Public ASN: ISP and public internet routes\nPrivate ASN: internal network use\nASN range 64512-65534 private\n16-bit and 32-bit ASN formats" },
      { q: "OSPF demand circuit optimization", a: "Reduces link bandwidth consumption\nDisables periodic hello/update retransmission\nUsed on expensive WAN links\nRequires hello packet on demand" },
      { q: "EIGRP DUAL algorithm", a: "Diffusing Update ALgorithm\nGuarantees loop-free paths\nComputes locally without flooding\nProvides fast convergence\nSupports unequal cost paths" },
      { q: "BGP bestpath selection criteria", a: "Weight (Cisco proprietary) highest preferred\nLocal preference next\nAS path length\nOrigin type\nMED value\nIGP metric to BGP next-hop" },
      { q: "Static routing use cases", a: "Point-to-point links\nSimple topologies\nStub networks\nBackup routes\nIncreases security vs dynamic protocols" },
      { q: "Dynamic routing protocol convergence", a: "Convergence: network reaches consistent routing state\nFast convergence important for uptime\nOSPF: sub-second with OSPF fast hello\nBGP: slower, minutes typically" },
      { q: "OSPF virtual link", a: "Connects discontiguous areas through backbone\nTransit area carries tunnel\nUseful for area restructuring\nShould be temporary solution" },
      { q: "BGP communities usage", a: "Group prefixes for policies\nStandard communities 16-bit format\nExtended communities 32-bit format\nPublic vs private communities\nUsed for traffic engineering" },
      { q: "Route redistribution administrative distance", a: "Modify AD of redistributed routes\nDefault varies by protocol\nIncreases AD to prefer IGP routes\nPrevents routing loops" },
      { q: "EIGRP passive interface impact", a: "Advertises network without sending hello\nReduces bandwidth usage\nNo neighbor adjacency on interface\nUseful for stub links" },
    ]
  },
  {
    id: "switching",
    name: "Switching Scenarios (77+ Q&A)",
    icon: "🔌",
    color: "#10b981",
    questions: [
      { q: "Configure 802.1Q trunking with 802.1Q", a: `**Real Scenario:** Enterprise network requiring VLAN extension between access and core switches. Need to configure trunk links to carry multiple VLANs while maintaining security.

**Complete Trunk Configuration:**

**1. Cisco IOS Switch Configuration:**
\`\`\`
! Enter global configuration mode
configure terminal

! Create VLANs first
vlan 10
 name DATA
 exit
vlan 20
 name VOICE
 exit
vlan 99
 name MANAGEMENT
 exit

! Configure trunk interface
interface GigabitEthernet0/1
 description "Trunk to Core Switch"
 switchport mode trunk
 switchport trunk encapsulation dot1q
 switchport trunk native vlan 99
 switchport trunk allowed vlan 10,20,99
 switchport nonegotiate  ! Disable DTP for security
 no shutdown
\`\`\`

**2. Trunk Security Configuration:**
\`\`\`
interface GigabitEthernet0/1
 ! Prevent VLAN hopping attacks
 switchport trunk native vlan tag  ! Tag native VLAN traffic
 ! Limit allowed VLANs
 switchport trunk allowed vlan remove 1  ! Remove default VLAN
 ! Enable BPDU guard
 spanning-tree bpduguard enable
 ! Enable port security
 switchport port-security
 switchport port-security maximum 2
 switchport port-security violation restrict
\`\`\`

**3. Advanced Trunk Features:**
\`\`\`
! Configure trunk with QoS
interface GigabitEthernet0/1
 mls qos trust cos
 priority-queue out
 ! Enable UDLD for link protection
 udld enable
 ! Configure port channel if needed
 channel-group 1 mode desirable
\`\`\`

**4. Juniper EX Switch Configuration:**
\`\`\`
# Configure VLANs
set vlans DATA vlan-id 10
set vlans VOICE vlan-id 20
set vlans MGMT vlan-id 99

# Configure trunk interface
set interfaces ge-0/0/1 description "Trunk to Core"
set interfaces ge-0/0/1 unit 0 family ethernet-switching port-mode trunk
set interfaces ge-0/0/1 unit 0 family ethernet-switching vlan members [DATA VOICE MGMT]
set interfaces ge-0/0/1 unit 0 family ethernet-switching native-vlan-id 99
\`\`\`

**5. HP/Aruba Switch Configuration:**
\`\`\`
# Configure VLANs
vlan 10 name "DATA"
vlan 20 name "VOICE"
vlan 99 name "MGMT"

# Configure trunk
interface 1
 description "Trunk to Core"
 trunk 10,20,99
 native-vlan 99
 lacp active
 exit
\`\`\`

**Verification Commands:**

**Cisco:**
\`\`\`
show interfaces trunk
show interfaces GigabitEthernet0/1 switchport
show vlan brief
show spanning-tree interface GigabitEthernet0/1
\`\`\`

**Juniper:**
\`\`\`
show interfaces ge-0/0/1 detail
show vlans
show ethernet-switching interfaces
\`\`\`

**Troubleshooting Trunk Issues:**

**Issue: Trunk not forming**
\`\`\`
! Check encapsulation mismatch
show interfaces trunk | include Encapsulation

! Verify DTP status
show interfaces GigabitEthernet0/1 | include DTP

! Check physical connectivity
show interfaces GigabitEthernet0/1 | include line protocol
\`\`\`

**Issue: VLANs not passing**
\`\`\`
! Verify allowed VLAN list
show interfaces trunk detail

! Check VLAN existence on both switches
show vlan id 10

! Verify native VLAN mismatch
show interfaces trunk | include Native
\`\`\`

**Issue: Native VLAN mismatch**
\`\`\`
! Configure matching native VLANs
switchport trunk native vlan 99  ! On both ends
\`\`\`

**Best Practices:**
- Always configure native VLAN explicitly
- Use dedicated VLAN for native traffic (not VLAN 1)
- Implement trunk security features (BPDU guard, root guard)
- Document trunk configurations and VLAN purposes
- Regularly audit allowed VLAN lists
- Use LACP for link aggregation when possible` },
      { q: "STP root bridge setup", a: `**Real Scenario:** Enterprise campus network with multiple switches. Need to optimize spanning tree convergence and prevent suboptimal path selection.

**Complete STP Root Bridge Configuration:**

**1. Determine Current Root Bridge:**
\`\`\`
! Check current STP status
show spanning-tree

! Identify current root bridge
show spanning-tree root

! Check bridge priorities
show spanning-tree bridge priority
\`\`\`

**2. Configure Primary Root Bridge:**
\`\`\`
! Set low priority for primary root (4096 = default + 1)
spanning-tree vlan 1 priority 4096

! Alternative: force primary root
spanning-tree vlan 1 root primary

! Configure secondary root (higher priority backup)
spanning-tree vlan 2 root secondary
\`\`\`

**3. Configure Secondary Root Bridge:**
\`\`\`
! Set higher priority than primary but lower than others
spanning-tree vlan 1 priority 8192

! Alternative method
spanning-tree vlan 1 root secondary
\`\`\`

**4. Interface-Level STP Configuration:**
\`\`\`
interface GigabitEthernet0/1
 description "Root port to Core"
 spanning-tree cost 1000
 spanning-tree port-priority 128
 spanning-tree guard root  ! Protect against superior BPDUs

interface GigabitEthernet0/2
 description "Backup link"
 spanning-tree cost 2000
 spanning-tree port-priority 192
\`\`\`

**5. Advanced STP Features:**
\`\`\`
! Enable PortFast on edge ports
spanning-tree portfast default
spanning-tree portfast bpduguard default

! Configure BPDU guard globally
spanning-tree portfast bpduguard default

! Enable loop guard
spanning-tree loopguard default

! Configure UDLD
udld enable
\`\`\`

**6. Per-VLAN STP (PVST+) Configuration:**
\`\`\`
! Different root bridges per VLAN
spanning-tree vlan 10 priority 4096
spanning-tree vlan 20 priority 8192
spanning-tree vlan 30 priority 12288
\`\`\`

**7. Rapid STP (RSTP) Configuration:**
\`\`\`
! Enable RSTP globally
spanning-tree mode rapid-pvst

! Configure link types
interface GigabitEthernet0/1
 spanning-tree link-type point-to-point
 spanning-tree portfast
\`\`\`

**Verification Commands:**
\`\`\`
show spanning-tree
show spanning-tree root
show spanning-tree interface GigabitEthernet0/1 detail
show spanning-tree vlan 1 bridge
show spanning-tree summary
\`\`\`

**Troubleshooting STP Issues:**

**Issue: Wrong root bridge elected**
\`\`\`
! Check bridge priorities
show spanning-tree bridge priority

! Force root bridge change
spanning-tree vlan 1 root primary force
\`\`\`

**Issue: Slow convergence**
\`\`\`
! Enable PortFast on edge ports
interface range GigabitEthernet0/10 - 24
 spanning-tree portfast

! Use Rapid STP
spanning-tree mode rapid-pvst
\`\`\`

**Issue: Bridge Protocol Data Units (BPDUs) received on edge ports**
\`\`\`
! Enable BPDU guard
spanning-tree portfast bpduguard

! Check for loops
show spanning-tree inconsistentports
\`\`\`

**Best Practices:**
- Document root bridge locations and backup switches
- Use root guard on designated ports
- Implement BPDU guard on all edge ports
- Monitor STP topology changes with logging
- Test failover scenarios regularly
- Use consistent STP mode across domain (PVST+ or MST)` },
      { q: "LACP configuration", a: "interface port-channel 1\ninterface eth0\nchannel-group 1 mode active\nshow lacp neighbor\nshow etherchannel load-balance" },
      { q: "Port security setup", a: "port-security\nport-security maximum 1\nport-security mac-address sticky\nport-security violation shutdown" },
      { q: "Voice VLAN config", a: "voice vlan 100\ninterface eth0\nswitchport access vlan 10\nswitchport voice vlan 100\ncdp enable" },
      { q: "VLAN creation", a: "vlan 10\nname DATA\nvlan 20\nname VOICE\nshow vlan brief" },
      { q: "SVI configuration", a: "interface vlan 10\nip address 10.0.0.1 255.255.255.0\nno shutdown\nshow interfaces vlan 10" },
      { q: "802.1X authentication", a: "dot1x system-auth-control\ninterface eth0\nauthentication port-control auto\ndot1x pae authenticator" },
      { q: "Storm control enable", a: "storm-control broadcast level 10 5\nstorm-control multicast level 10\nstorm-control unicast level 10" },
      { q: "STP port cost", a: "interface eth0\nspanning-tree cost 100\nspanning-tree port-priority 128\nshow spanning-tree interface" },
      { q: "BPDU guard config", a: "spanning-tree portfast\nspanning-tree bpduguard enable\nerrdisable recovery cause bpduguard\nerrdisable recovery interval 300" },
      { q: "Private VLAN edge", a: "switchport protected\nProtected ports blocked from each other\nAllow to unprotected ports" },
      { q: "QoS configuration", a: "priority-queue out\nmls qos\nqueue-limit 64\nshaping per interface" },
      { q: "MAC address table", a: "mac address-table aging-time 300\nmac address-table static 0011.2233.4455 vlan 10\nshow mac-address-table" },
      { q: "Port mirroring SPAN", a: "monitor session 1 source interface eth0\nmonitor session 1 destination interface eth48\nshow monitor session all" },
      { q: "RSTP configuration", a: "spanning-tree mode rstp\nspanning-tree portfast default\nspanning-tree priority 0\nFaster than STP" },
      { q: "MLAG setup", a: "Multi-chassis link aggregation\nPE routers with common IP\nPeering over Ethernet\nActive-active links" },
      { q: "Trunk allowed VLAN", a: "switchport trunk allowed vlan 1-100\nswitchport trunk allowed vlan remove 50\nswitchport trunk allowed vlan add 150-160" },
      { q: "VTP configuration", a: "vtp domain CORP\nvtp mode server\nvtp password secret123\nvtp pruning" },
      { q: "Per-interface config", a: "speed 1000\nduplex full\nmtu 1500\nmtu 9000 (jumbo frames)" },
      { q: "DTP disable", a: "switchport mode access\nno switchport nonegotiate on trunks\nPrevent accidental trunking" },
      { q: "Port channel hash", a: "port-channel load-balance src-dst-ip\nport-channel load-balance src-mac\nport-channel load-balance method\nAffects traffic distribution" },
      { q: "VLAN pruning", a: "Remove VLANs from trunk\nReduce spanning-tree instances\nBandwidth optimization\nSwitchport trunk allowed vlan" },
      { q: "MAC learning limit", a: "mac-learning limit 100\nmac-learning action alarm\nmac-learning disable\nPrevent MAC overflow attacks" },
      { q: "Interface spanning-tree", a: "show spanning-tree interface brief\nshow spanning-tree interface detail\nVerify port role, state, cost" },
      { q: "Rapid PVST config", a: "spanning-tree mode rapid-pvst\nFaster convergence\nPer-VLAN instance\nBackward compatible with STP" },
      { q: "MSTP configuration", a: "Multiple spanning-tree instances\nRegion name configuration\nVLAN mapping to instances\nReduces CPU usage" },
      { q: "Class-based QoS", a: "class-map match-any VOICE\nmatch dscp ef\npolicy-map QOS\nclass VOICE priority 30" },
      { q: "Access list on switch", a: "access-list 100 permit tcp any any eq 80\ninterface vlan 10\nip access-group 100 in" },
      { q: "VLAN routing", a: "ip routing on switch\ninterface vlan 10\nip address 10.0.0.1 255.255.255.0\nrouter protocols (ospf, bgp)" },
      { q: "Switch stack", a: "Multiple switches as single unit\nStack ports for high BW\nOne management IP\nAutomatic failover" },
      { q: "PoE configuration", a: "power inline auto\npower inline static\npower inline never\nmon power inline" },
      { q: "Port blocking", a: "switchport block multicast\nswitchport block unicast\nPrevents flooding on switchport" },
      { q: "STP timers", a: "forward-delay 15\nmax-age 20\nhello 2\ntimers basic (update timers)" },
      { q: "VLAN hopping prevention", a: "Disable DTP\nExplicit vlan config\nNo switch port management\nSet native vlan" },
      { q: "CDP disable", a: "no cdp run\nno cdp enable (per interface)\nSecurity best practice\nPrevents discovery" },
      { q: "IGMP snooping", a: "ip igmp snooping\nip igmp snooping vlan 1\nPrevents multicast flooding\nReduces bandwidth" },
      { q: "MAC notification", a: "mac address-table notification changes\nmac address-table notification history-size 100\nShow MAC change events" },
      { q: "Bandwidth limit interface", a: "traffic-shape rate 100000000\nrate-limit output\nPolicy map policing" },
      { q: "Microbe spanning-tree", a: "Rapid STP convergence\nP/A mechanism\nForward all non-edge ports\nDisable edge port on edge" },
      { q: "VLAN load balancing", a: "hash algorithm\nsrc-dst-mac, src-dst-ip\nNot per-flow distribution\nBased on packet header" },
      { q: "Interface isolation", a: "Private VLAN\nSwitchport protected\nPrevents inter-port communication\nUseful for sharing link" },
      { q: "EtherChannel load balance", a: "L2: MAC addresses\nL3: IP addresses\nL4: TCP/UDP ports\nSrc/dst combinations" },
      { q: "Broadcast suppression", a: "storm-control broadcast\nThreshold percentage\nAction shutdown/trap\nRecovery: errdisable recovery" },
      { q: "Configure VLAN trunking protocols", a: "VTP for VLAN propagation or manual configuration\nVTP modes: server, client, transparent\nVTP pruning reduces unnecessary traffic\nModern practice avoids VTP for security" },
      { q: "Implement rapid spanning tree protocol", a: "RSTP faster convergence than STP\nEdge ports for access layer\nProposal/agreement mechanism for rapid transitions\nDefault 802.1w (not per-VLAN)" },
      { q: "Configure multiple spanning tree protocol", a: "MSTP allows different spanning trees per region\nDefine MST regions and instances\nReduces overhead vs per-VLAN STP\nComplex but powerful" },
      { q: "Implement port aggregation", a: "EtherChannel combines physical ports into logical link\nLACP (802.3ad) or PAgP\nManual mode also available\nLoad balancing across active members" },
      { q: "Configure access control lists on switches", a: "VACLs filter traffic between VLANs\nApplied before routing\nProtocol-based filtering\nLayer 2 switching optimization" },
      { q: "Implement Dynamic ARP Inspection", a: "DAI protects against ARP spoofing\nUses DHCP snooping binding database\nValidates ARP requests/replies\nPrevents ARP-based attacks" },
      { q: "Configure DHCP snooping", a: "Trusted ports for DHCP servers\nUntrusted for clients\nPrevents rogue DHCP servers\nRate limiting per port\nBinding database for other functions" },
      { q: "Implement MAC-based port security", a: "Limit MAC addresses per port\nActions: restrict, protect, or shutdown\nSticky MAC learning\nPrevents unauthorized access" },
      { q: "Configure storm control", a: "Limits broadcast/multicast/unknown-unicast traffic\nPercentage-based thresholds\nActions: shutdown or trap\nPrevents network storms" },
      { q: "Implement VLAN security", a: "Separate broadcast domains for security\nVLAN access control lists (VACL)\nPrivate VLANs for isolation\nInter-VLAN routing through firewall" },
      { q: "Configure first-hop redundancy", a: "HSRP (Hot Standby Routing Protocol) for gateway redundancy\nVRRP (Virtual Router Redundancy Protocol) standards-based\nGLBP (Gateway Load Balancing Protocol) for load sharing" },
      { q: "Implement spanning tree BPDU filtering", a: "Disable BPDU processing on edge ports\nFaster convergence\nRisky if configured incorrectly\nUse with portfast" },
      { q: "Configure IP SLA on switches", a: "Monitor link quality using IP SLA\nReaction to loss of connectivity\nIntegration with routing for failover\nGranular control over path selection" },
      { q: "Implement jumbo frames", a: "Support for frames larger than 1500 bytes\nReduces overhead\nNeed end-to-end support\nConfiguration: MTU size" },
      { q: "Configure switch QoS", a: "Mark traffic priority using cos (Class of Service)\nMap to DSCP\nQueue management and dropping policies\nPer-port and system-level configuration" },
      { q: "STP port cost calculation", a: "Based on interface speed\nCisco: 100Mbps / interface speed\n10Mbps = 100, 100Mbps = 19, 1000Mbps = 4\nManually override with cost command" },
      { q: "VLAN trunk allowed-vlan list", a: "Specifies which VLANs allowed on trunk\nAll VLANs by default\nCan exclude specific VLANs\nManage with switchport trunk allowed vlan" },
      { q: "Native VLAN on trunk", a: "Default VLAN on trunk (untagged)\nBoth sides must match\nMismatch causes VLAN hopping vulnerability\nTypically VLAN 1 (should change)" },
      { q: "Portfast and BPDU Guard", a: "Portfast skips STP states on access ports\nBPDU guard error-disables if BPDU received\nPrevents rogue switch connection\nShould be on access layer only" },
      { q: "MAC address table aging", a: "Dynamic entries age out (default 300s)\nStatic entries don't age\nRe-learned if traffic reappears\nShorten for high-mobility environments" },
      { q: "Private VLAN (pVLAN)", a: "Primary VLAN for community\nCommunity VLANs talk to primary\nIsolated VLANs only talk to promiscuous port\nUseful for multi-tenant security" },
      { q: "VLAN access lists vs trunk lists", a: "VACL: filters traffic between VLANs\nTrunk list: specifies allowed VLANs on physical link\nDifferent purposes, often both configured" },
      { q: "Spanning tree port states timeline", a: "Blocking (20 sec default) → Listening (15 sec) → Learning (15 sec) → Forwarding\nRSTP: disabled/discarding → learning → forwarding\nRSTP much faster convergence" },
      { q: "EtherChannel load balancing algorithms", a: "Layer 2: src/dst MAC\nLayer 3: src/dst IP\nLayer 4: src/dst ports\nAlgorithm per-device, not per-flow" },
      { q: "Storm control threshold", a: "Percentage of link bandwidth\nActions: shutdown (err-disable) or trap (SNMP)\nApplies to broadcast, multicast, unknown-unicast\nRecovery after timeout" },
      { q: "DHCP snooping trusted vs untrusted", a: "Trusted: DHCP server ports\nUntrusted: client ports\nBindings built from untrusted\nOption 82 added for tracking" },
      { q: "ARP inspection trusted database", a: "Built from DHCP snooping bindings\nValidates IP-to-MAC mapping\nBlocks unsolicited ARP replies\nProtects against ARP spoofing attacks" },
      { q: "Port security sticky MAC", a: "Automatically learns secure MAC addresses\nConverts to permanent entry\nSurvives reboot if configured\nUseful for plug-and-play security" },
      { q: "Switch CPU and backplane limits", a: "CPU handles management traffic\nBackplane (bus) handles data traffic\nBackplane limits switching capacity\nCPU impacts configuration processing" },
      { q: "802.3ad LACP negotiation", a: "Active: initiates LACP negotiation\nPassive: responds to LACP\nMust have at least one active side\nSends LACP packets every second" },
    ]
  },
  {
    id: "firewall",
    name: "Firewall Scenarios (77+ Q&A)",
    icon: "🔒",
    color: "#ef4444",
    questions: [
      { q: "Configure Cisco ASA DMZ with NAT", a: `**Real Scenario:** Enterprise network requiring secure web server exposure to internet while maintaining internal network isolation. DMZ hosts web, email, and DNS servers.

**Complete ASA DMZ Configuration:**

**1. Interface Configuration:**
\`\`\`
! Configure interfaces
interface GigabitEthernet0/0
 nameif outside
 security-level 0
 ip address 203.0.113.1 255.255.255.248
 no shutdown

interface GigabitEthernet0/1
 nameif inside
 security-level 100
 ip address 10.0.0.1 255.255.255.0
 no shutdown

interface GigabitEthernet0/2
 nameif dmz
 security-level 50
 ip address 172.16.0.1 255.255.255.0
 no shutdown
\`\`\`

**2. Security Policies (Default Behavior):**
\`\`\`
! Higher to lower security level allowed by default
! Lower to higher requires explicit ACL
! Same security level requires same-security-traffic permit inter-interface
\`\`\`

**3. Static NAT for DMZ Servers:**
\`\`\`
! Web server NAT (inside IP to outside IP)
static (dmz,outside) 203.0.113.10 172.16.0.10 netmask 255.255.255.255

! Email server NAT
static (dmz,outside) 203.0.113.11 172.16.0.11 netmask 255.255.255.255

! DNS server NAT
static (dmz,outside) 203.0.113.12 172.16.0.12 netmask 255.255.255.255
\`\`\`

**4. Access Control Lists:**
\`\`\`
! Outside to DMZ access
access-list OUTSIDE_TO_DMZ extended permit tcp any host 203.0.113.10 eq www
access-list OUTSIDE_TO_DMZ extended permit tcp any host 203.0.113.11 eq smtp
access-list OUTSIDE_TO_DMZ extended permit tcp any host 203.0.113.11 eq pop3
access-list OUTSIDE_TO_DMZ extended permit tcp any host 203.0.113.12 eq domain
access-list OUTSIDE_TO_DMZ extended permit udp any host 203.0.113.12 eq domain

! Apply ACL to interface
access-group OUTSIDE_TO_DMZ in interface outside
\`\`\`

**5. Dynamic NAT/PAT Configuration:**
\`\`\`
! PAT for DMZ to outside (overload)
nat (dmz) 1 172.16.0.0 255.255.255.0
global (outside) 1 interface

! NAT exemption for VPN traffic
nat (dmz) 0 access-list NONAT
access-list NONAT extended permit ip 172.16.0.0 255.255.255.0 10.0.0.0 255.255.255.0
\`\`\`

**6. Security Services:**
\`\`\`
! Enable inspections
inspect http
inspect ftp
inspect smtp
inspect dns

! Configure MPF for advanced inspection
class-map HTTP_INSPECT
 match port tcp eq 80
policy-map global_policy
 class HTTP_INSPECT
  inspect http
service-policy global_policy global
\`\`\`

**7. DMZ Server Access from Inside:**
\`\`\`
! Allow inside to DMZ access
access-list INSIDE_TO_DMZ extended permit ip 10.0.0.0 255.255.255.0 172.16.0.0 255.255.255.0
access-group INSIDE_TO_DMZ in interface inside

! NAT for inside to DMZ (identity NAT)
nat (inside) 0 10.0.0.0 255.255.255.0
\`\`\`

**Verification Commands:**
\`\`\`
show interface ip brief
show nat
show xlate
show access-list
show conn
show asp drop
\`\`\`

**Troubleshooting DMZ Issues:**

**Issue: Cannot access DMZ server from outside**
\`\`\`
! Check NAT translation
show xlate | include 172.16.0.10

! Verify ACL hit count
show access-list OUTSIDE_TO_DMZ | include hitcnt

! Check routing
show route
\`\`\`

**Issue: DMZ cannot access internet**
\`\`\`
! Check NAT configuration
show nat | include dmz

! Verify global statement
show running-config | include global

! Check DNS resolution
ping 8.8.8.8
\`\`\`

**Issue: Traffic blocked between interfaces**
\`\`\`
! Check security levels
show nameif

! Verify ACLs
show access-list

! Check for implicit deny
show asp drop flow
\`\`\`

**Best Practices:**
- Use dedicated interfaces for each security zone
- Implement least privilege access rules
- Enable logging for security monitoring
- Use object groups for scalable configuration
- Regularly audit and update access rules
- Implement intrusion prevention on DMZ interface` },
      { q: "Troubleshoot FortiGate IPsec VPN", a: `**Real Scenario:** Branch office VPN connection failing after ISP change. Users cannot access corporate resources. Need systematic troubleshooting approach.

**Step-by-Step FortiGate VPN Troubleshooting:**

**1. Check VPN Tunnel Status:**
\`\`\`
# Check tunnel status
get vpn ipsec tunnel summary

# Detailed tunnel information
get vpn ipsec tunnel details

# Check Phase 1 and Phase 2 status
diagnose vpn ipsec status
\`\`\`

**2. Phase 1 (IKE) Troubleshooting:**

**Issue: Phase 1 not establishing**
\`\`\`
# Check IKE debug
diagnose debug application ike -1
diagnose debug enable

# Common Phase 1 issues:
# - Pre-shared key mismatch
# - Peer IP address incorrect
# - NAT-T issues
# - Certificate problems
\`\`\`

**Phase 1 Configuration Verification:**
\`\`\`
config vpn ipsec phase1-interface
    edit "Branch_VPN"
        set interface "wan1"
        set peertype any
        set net-device disable
        set proposal aes256-sha256 aes256-sha1
        set dhgrp 14 5 2
        set remote-gw 203.0.113.1
        set psksecret MySecurePSK123
        set dpd on-idle
        set nattraversal enable
    next
end
\`\`\`

**3. Phase 2 (IPsec) Troubleshooting:**

**Issue: Phase 2 not establishing**
\`\`\`
# Check IPsec debug
diagnose debug application ipsec -1
diagnose debug enable

# Verify Phase 2 selectors
diagnose vpn tunnel list
\`\`\`

**Phase 2 Configuration:**
\`\`\`
config vpn ipsec phase2-interface
    edit "Branch_VPN_P2"
        set phase1name "Branch_VPN"
        set proposal aes256-sha256 aes256-sha1
        set dhgrp 14 5 2
        set keylifeseconds 3600
        set src-subnet 192.168.1.0 255.255.255.0
        set dst-subnet 10.0.0.0 255.255.255.0
    next
end
\`\`\`

**4. Routing and Policy Issues:**

**Issue: Traffic not flowing through tunnel**
\`\`\`
# Check routing table
get router info routing-table all

# Verify firewall policies
show firewall policy

# Check for policy allowing VPN traffic
config firewall policy
    edit 1
        set srcintf "internal"
        set dstintf "Branch_VPN"
        set srcaddr "all"
        set dstaddr "all"
        set action accept
        set schedule "always"
        set service "ALL"
    next
end
\`\`\`

**5. NAT-T and Firewall Issues:**

**Issue: Behind NAT device**
\`\`\`
# Enable NAT-T
config vpn ipsec phase1-interface
    edit "Branch_VPN"
        set nattraversal enable
        set natt-port-float enable
    next
end

# Check for ESP protocol allow
config firewall policy
    edit 2
        set srcintf "wan1"
        set dstintf "wan1"
        set srcaddr "all"
        set dstaddr "all"
        set action accept
        set schedule "always"
        set service "ESP"
    next
end
\`\`\`

**6. Common VPN Issues and Solutions:**

**Issue: Tunnel flaps frequently**
\`\`\`
# Increase DPD timeout
config vpn ipsec phase1-interface
    edit "Branch_VPN"
        set dpd on-idle
        set dpd-retryinterval 10
        set dpd-retrycount 3
    next
end

# Check ISP stability
execute ping-options source wan1
execute ping 8.8.8.8
\`\`\`

**Issue: Certificate-based VPN failing**
\`\`\`
# Check certificate status
diagnose vpn certificate list

# Verify certificate chain
diagnose vpn certificate verify

# Import correct certificates
config vpn certificate local
    edit "Branch_Cert"
        set certificate "branch.crt"
        set private-key "branch.key"
    next
end
\`\`\`

**7. Monitoring and Logging:**
\`\`\`
# Enable VPN logging
config log setting
    set vpn-traffic enable
end

# Check VPN logs
execute log filter category vpn
execute log display
\`\`\`

**8. Performance Troubleshooting:**
\`\`\`
# Check tunnel bandwidth
diagnose vpn ipsec tunnel stat

# Monitor encryption/decryption
get system performance status

# Adjust MSS/MTU
config vpn ipsec phase1-interface
    edit "Branch_VPN"
        set set-tos enable
        set set-df-bit enable
    next
end
\`\`\`

**Verification Commands:**
\`\`\`
get vpn ipsec tunnel summary
diagnose vpn ipsec status
get router info routing-table
ping -c 4 10.0.0.1  # Test through tunnel
\`\`\`

**Best Practices:**
- Use strong pre-shared keys or certificates
- Enable NAT-T for remote users
- Configure DPD for dead peer detection
- Monitor tunnel status with SNMP/logging
- Test failover scenarios regularly
- Document all VPN parameters and configurations` },
      { q: "Palo Alto app control", a: "Create policy with app group\nThreat prevention profiles\nEnable anti-virus, spyware, url\nLog and block actions" },
      { q: "Zone-based firewall", a: "config zone security INSIDE\nconfig zone security OUTSIDE\npolicy-map type inspect\nzone-pair security IN-OUT" },
      { q: "Juniper SRX SSL proxy", a: "show security certificates local\nssl inspection enable\nCertificate import/export\nDebug: monitor traffic" },
      { q: "Check Point user policies", a: "LDAP integration\nUser group definition\nAccess control rules\nAuthentication settings" },
      { q: "FortiGate HA setup", a: "config system ha\nmode a-p (active-passive)\npriority 200 (primary)\nheartbeat port\nmonitor port1 port2" },
      { q: "URL filtering policy", a: "Blocked categories: adult, malware\nWarned categories: gambling\nAllowed: news, business\nCustom allow/block lists" },
      { q: "SonicWall DPI", a: "Deep Packet Inspection\nSSL inspection\nMalware detection\nIPS/IDS integration" },
      { q: "ASA NAT configuration", a: "nat (inside) 1 0.0.0.0 0.0.0.0\nstatic (inside,outside) 203.0.113.1 10.0.0.1 netmask 255.255.255.255" },
      { q: "Check Point IPS", a: "Signature updates\nAuto-update: daily\nCreate IPS policy\nThreat protection profiles" },
      { q: "Palo Alto user identity", a: "AD integration\nSSAML authentication\nUser-based policies\nGroup-based rules" },
      { q: "Cisco ASA logging", a: "logging enable\nlogging console\nlogging buffer\nlogging trap informational" },
      { q: "FortiGate DLP", a: "config dlp dictionary\nDatatype definition\nDLP profile creation\nAction: alert, drop, log" },
      { q: "Juniper SRX policies", a: "Security policy hierarchy\nFrom zone, To zone\nSource, destination\nApplication, service" },
      { q: "Arista firewall rules", a: "Access control list\nNetflow configuration\nTraffic mirroring\nDDoS protection" },
      { q: "Huawei firewall zones", a: "Security zones: trust, untrust, dmz\nZone policies\nAccess control\nNAT rules" },
      { q: "ASA access list", a: "access-list INBOUND permit ip any any\naccess-group INBOUND in interface outside\nExt ACL: protocol, source, dest, port" },
      { q: "Palo Alto content filtering", a: "Signature-based\nThreat prevention\nVulnerability protection\nAuto-update" },
      { q: "SonicWall policy", a: "Firewall rule priority\nSource/dest zones\nAction: allow/deny\nLogging option" },
      { q: "Check Point encryption", a: "IPsec tunnels\nSSL/TLS inspection\nCertificate management\nEncryption algorithms" },
      { q: "FortiGate captive portal", a: "Authentication method\nUser group assignment\nSSL certificate\nTraffic redirect" },
      { q: "ASA failover", a: "Active-standby\nHeartbeat on LAN\nSync configuration\nAutomatic takeover" },
      { q: "Palo Alto FQDN object", a: "Dynamic IP resolution\nDomain name matching\nWildcard support\nScheduled updates" },
      { q: "SonicWall GAV", a: "Gateway antivirus\nSignature updates\nFile type blocking\nIncident handling" },
      { q: "Juniper SRX UTM", a: "Unified threat management\nWeb filtering\nAntivirus\nAnti-spam" },
      { q: "Cisco ASA VPN", a: "IPsec tunnel\nPhase 1: IKE\nPhase 2: IPsec\nEncryption, authentication, DH group" },
      { q: "Check Point SmartConsole", a: "Policy management\nAccess control\nThreat prevention\nFirewall rules" },
      { q: "Palo Alto panorama", a: "Centralized management\nMultiple devices\nPolicy push\nLogging aggregation" },
      { q: "FortiGate SSL VPN", a: "Remote access\nSSL encryption\nUser authentication\nSplit tunneling" },
      { q: "ASA DHCP relay", a: "dhcp-server inside\ndhcp relay server outside\ndhcp relay timeout\ndhcp relay option" },
      { q: "Juniper SRX flow session", a: "show security flow session\nFlow monitoring\nConnection tracking\nSession timeout" },
      { q: "Palo Alto schedules", a: "Traffic scheduling\nTime-based policies\nSchedule objects\nApply to rules" },
      { q: "SonicWall WAN acceleration", a: "Compression\nCaching\nBandwidth optimization\nLatency reduction" },
      { q: "Check Point event tracking", a: "Log queries\nAuthentication logs\nConnection logs\nIncident tracking" },
      { q: "FortiGate multicast", a: "multicast source\nmulticast router\nIGMP snooping\nRPF check" },
      { q: "ASA inspection", a: "inspect protocol\ninspect dns\ninspect http\ninspect ftp" },
      { q: "Palo Alto EDL", a: "External Dynamic Lists\nDynamic URL categories\nIP reputation\nCustom lists" },
      { q: "Juniper SRX logging", a: "Traffic logging\nSecurity policy logging\nSystem logging\nLog streaming" },
      { q: "Cisco ASA command prompt", a: "enable mode\nconfig terminal\nshow commands\nclear commands" },
      { q: "Check Point backup", a: "Configuration backup\nScheduled backup\nRecovery procedures\nVersion control" },
      { q: "FortiGate interface bonding", a: "Active-passive bonding\nActive-active load balance\nFail-over bond\nSpeed+duplex" },
      { q: "Palo Alto mobile app", a: "Remote administration\nPolicy management\nLive monitoring\nIncident response" },
      { q: "Configure firewall stateful inspection", a: "Firewalls track connection state\nOutbound connections automatically allowed inbound\nUDP timeout shorter than TCP\nReturn traffic permitted without rules" },
      { q: "Implement firewall zones", a: "Segment networks with trust levels\nHigh security zone to DMZ to internet\nExplicit policies between zones\nSimplifies rule management" },
      { q: "Configure Network Address Translation", a: "Hide internal IPs behind public addresses\nStatic NAT for servers\nDynamic NAT for clients\nPAT (Port Address Translation) for many-to-one mapping" },
      { q: "Implement destination NAT", a: "Publish internal services on public IPs\nInbound traffic translated to internal server\nEnables load balancing\nMaintains state for return traffic" },
      { q: "Configure firewall redundancy", a: "Active-passive failover or active-active\nHeartbeat monitoring for health\nState synchronization for connection tracking\nEnables maintenance without downtime" },
      { q: "Implement application-layer gateways", a: "Proxy-based deep inspection\nUnderstands HTTP, FTP, SMTP\nRewrites headers and URLs\nSlower but thorough security" },
      { q: "Configure URL filtering", a: "Category-based website blocking\nPolicy-based access control\nIntegration with content databases\nCan bypass with HTTPS inspection" },
      { q: "Implement malware protection", a: "Scanning files for malicious code\nSandboxing suspicious executables\nCloud-based reputation checking\nUpdates required frequently" },
      { q: "Configure intrusion prevention system", a: "Signature-based attack detection\nBlocks malicious traffic in real-time\nFalse positive tuning required\nIntegration with threat intelligence" },
      { q: "Implement deep packet inspection", a: "Analyze application-layer traffic\nDetect encrypted threats via behavioral analysis\nCPU intensive\nBalanced with performance needs" },
      { q: "Configure SSL/TLS inspection", a: "Decrypt HTTPS for inspection\nInstall firewall certificate on clients\nPrivacy and compliance concerns\nEnables HTTPS threat detection" },
      { q: "Implement VPN authentication", a: "Pre-shared keys for simplicity\nCertificates for scalability\nMFA adds security\nRADIUS/TACACS+ for centralized auth" },
      { q: "Configure VPN redundancy", a: "Multiple tunnel endpoints for failover\nLoad balancing across tunnels\nAutomatic failover on tunnel loss\nMonitoring for tunnel health" },
      { q: "Implement policy-based routing", a: "Route based on source, destination, application\nBypass firewall for trusted traffic\nLoad balancing across multiple paths\nFlexible traffic steering" },
      { q: "Configure firewall logging and alerts", a: "Log all connections or policy violations\nSyslog to central server\nReal-time alerts for suspicious activity\nCorrelation for attack detection" },
      { q: "Firewall connection state table", a: "Tracks active connections\nInbound traffic matched to established connection\nStateless: only looks at packet headers\nStateful: maintains connection context" },
      { q: "IPS vs IDS placement", a: "IPS: in-line, blocks traffic\nIDS: passive monitor, alerts only\nIPS requires rule tuning to avoid false positives\nIDS less risky but reactive" },
      { q: "Firewall asymmetric routing", a: "Return traffic takes different path\nMust be allowed inbound\nTroubleshoot with packet trace\nCommon in multi-path networks" },
      { q: "VPN tunnel rekey", a: "Session lifetime expired\nSecurity keys regenerated\nMake-before-break reduces downtime\nClient-initiated vs server-initiated" },
      { q: "Firewall failover state sync", a: "Primary sends connection state to standby\nHeavy bandwidth usage\nEssential for stateful connections\nCan sync full or delta updates" },
      { q: "Application identification (AppID)", a: "Deep packet inspection\nIdentifies app regardless of port\nUsed for policy enforcement\nAvoids port-based evasion" },
      { q: "Zero trust security model", a: "Never trust, always verify\nDevice-based, not network-based\nUser identity important\nMicro segmentation at granular level" },
      { q: "Firewall high availability active-active", a: "Both devices process traffic\nLoad balanced across devices\nBoth maintain session state\nComplexity vs active-passive tradeoff" },
      { q: "SSL/TLS decryption exemptions", a: "Skip inspection for specific domains\nPerformance improvement\nPrivacy concerns\nRisk of encrypted malware" },
      { q: "URL category updates", a: "Dynamic lists updated regularly\nNew domains categorized\nFalse positives possible\nCustom categories override default" },
      { q: "Firewall rule tuning", a: "Monitor hit counts on rules\nRemove unused rules\nConsolidate overlapping rules\nImprove performance and clarity" },
      { q: "DDoS protection mechanisms", a: "Rate limiting\nConnection limits\nBehavioral analysis\nSpoofing prevention\nSYN flood mitigation" },
      { q: "Firewall logging volume", a: "All connections vs violations only\nStorage and performance impact\nCompromise: log critical + sample normal\nCentral logging aggregation" },
      { q: "Threat intelligence integration", a: "Real-time feeds of malicious IPs\nURL reputation\nFile hash databases\nAutomatic policy enforcement" },
      { q: "Firewall default rules", a: "Default deny most secure\nDefault allow most permissive\nExplicit rules must override defaults\nTesting mode for initial rollout" },
    ]
  }
];


const VendorInterviewQuestions = () => {
  const [selectedCategory, setSelectedCategory] = useState("routing");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);

  const selectedCategoryData = VENDOR_INTERVIEW_CATEGORIES.find(
    (cat) => cat.id === selectedCategory
  );

  const filteredQuestions = selectedCategoryData.questions.filter((item) =>
    item.q.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <div
        style={{
          backgroundColor: "#f3f4f6",
          padding: "30px",
          borderRadius: "8px",
          marginBottom: "30px",
          textAlign: "center"
        }}
      >
        <h1 style={{ margin: "0 0 10px 0", color: "#111827" }}>
          🎓 500+ Vendor Interview Q&A
        </h1>
        <p style={{ margin: "0", color: "#6b7280", fontSize: "16px" }}>
          {filteredQuestions.length} questions • Total: 500+ across Routing, Switching & Firewall
        </p>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        {VENDOR_INTERVIEW_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              setSearchTerm("");
              setExpandedIndex(null);
            }}
            style={{
              padding: "10px 15px",
              borderRadius: "6px",
              border: "none",
              backgroundColor:
                selectedCategory === cat.id
                  ? cat.color
                  : "#e5e7eb",
              color:
                selectedCategory === cat.id ? "#fff" : "#374151",
              cursor: "pointer",
              fontWeight: "500",
              transition: "all 0.3s"
            }}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search questions..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setExpandedIndex(null);
          }}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            fontSize: "14px"
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {filteredQuestions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
            No questions found. Try a different search term.
          </div>
        ) : (
          filteredQuestions.map((item, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "#fff"
              }}
            >
              <button
                onClick={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
                style={{
                  width: "100%",
                  padding: "15px",
                  backgroundColor:
                    expandedIndex === index
                      ? selectedCategoryData.color
                      : "#f9fafb",
                  color:
                    expandedIndex === index
                      ? "#fff"
                      : "#111827",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "15px",
                  fontWeight: "500",
                  transition: "all 0.3s"
                }}
              >
                Q: {item.q.substring(0, 80)}
                {item.q.length > 80 ? "..." : ""}
              </button>

              {expandedIndex === index && (
                <div
                  style={{
                    padding: "15px",
                    backgroundColor: "#fafafa",
                    borderTop: `3px solid ${selectedCategoryData.color}`
                  }}
                >
                  <div
                    style={{
                      marginBottom: "10px",
                      color: "#374151",
                      fontSize: "14px",
                      lineHeight: "1.6"
                    }}
                  >
                    <strong>Answer:</strong>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#fff",
                      padding: "12px",
                      borderRadius: "6px",
                      borderLeft: `4px solid ${selectedCategoryData.color}`,
                      fontFamily: "monospace",
                      fontSize: "13px",
                      whiteSpace: "pre-wrap",
                      overflowX: "auto",
                      color: "#111827",
                      lineHeight: "1.6"
                    }}
                  >
                    {item.a}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VendorInterviewQuestions;
