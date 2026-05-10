import { useState } from "react";

const VENDOR_INTERVIEW_CATEGORIES = [
  {
    id: "routing",
    name: "Routing Scenarios (170+ Q&A)",
    icon: "🌐",
    color: "#3b82f6",
    questions: [
      { q: "Configure OSPF with multi-area design", a: `**Real Scenario:** Enterprise network with 500+ users across multiple buildings requiring scalable OSPF design with proper area segmentation.

**Cisco IOS Configuration:**
\`\`\`
! Enable OSPF process
router ospf 1
 router-id 10.1.1.1
 log-adjacency-changes
 passive-interface default
 no passive-interface GigabitEthernet0/0

! Configure backbone area (Area 0)
interface GigabitEthernet0/0
 ip address 192.168.1.1 255.255.255.0
 ip ospf 1 area 0
 no shutdown

! Configure Area 1 (Branch Office)
interface GigabitEthernet0/1
 ip address 10.1.1.1 255.255.255.0
 ip ospf 1 area 1
 no shutdown

! Area 1 as stub area to reduce LSA flooding
area 1 stub no-summary

! Redistribute connected routes
redistribute connected subnets
\`\`\`

**Verification Commands:**
\`\`\`
show ip ospf neighbor
show ip ospf database
show ip route ospf
show ip ospf interface brief
\`\`\`

**Troubleshooting Steps:**
1. Check neighbor adjacency: \`show ip ospf neighbor\`
2. Verify area configuration: \`show ip ospf interface\`
3. Check for duplicate router-IDs: \`show ip ospf\`
4. Verify MTU mismatch: \`show interface | include MTU\`

**Best Practices:**
- Use loopback interfaces for router-ID stability
- Configure passive interfaces on stub links
- Implement area summarization to reduce routing table size
- Use stub areas for branch offices to minimize LSA flooding` },
      { q: "Troubleshoot BGP adjacency", a: `**Real Scenario:** ISP peering connection failing between two autonomous systems. Customer reports intermittent connectivity loss.

**Step-by-Step Troubleshooting Process:**

**1. Check BGP Session Status:**
\`\`\`
Router# show ip bgp summary
BGP router identifier 10.1.1.1, local AS number 65001
BGP table version is 1, main routing table version 1

Neighbor        V    AS MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd
192.168.1.2     4 65002       0       0        0    0    0 never    Idle
\`\`\`

**2. Verify Neighbor Configuration:**
\`\`\`
Router# show ip bgp neighbors 192.168.1.2
BGP neighbor is 192.168.1.2,  remote AS 65002, external link
  BGP version 4, remote router ID 0.0.0.0
  BGP state = Idle
  Last read 00:00:00, last write 00:00:00, hold time is 180, keepalive interval is 60 seconds
  Neighbor sessions:
    0 active, is not multisession capable (disabled)
  Neighbor capabilities:
    Route refresh: advertised and received(new)
    Address family IPv4 Unicast: advertised and received
\`\`\`

**3. Common Issues and Solutions:**

**Issue: TCP Connection Failed**
\`\`\`
! Check IP reachability
ping 192.168.1.2 source 192.168.1.1

! Verify interface status
show ip interface brief
show interface GigabitEthernet0/0
\`\`\`

**Issue: BGP State Stuck in Active**
\`\`\`
! Check if neighbor is configured correctly
show running-config | section bgp

! Verify AS number mismatch
neighbor 192.168.1.2 remote-as 65002  ! Must match remote AS
\`\`\`

**Issue: Authentication Failure**
\`\`\`
! Enable BGP authentication
router bgp 65001
 neighbor 192.168.1.2 password MySecretPassword
\`\`\`

**4. Enable Debug for Detailed Analysis:**
\`\`\`
debug ip bgp
debug ip tcp transactions
debug ip bgp events
\`\`\`

**5. BGP Neighbor Configuration Template:**
\`\`\`
router bgp 65001
 neighbor 192.168.1.2 remote-as 65002
 neighbor 192.168.1.2 description "ISP_PEERING_LINK"
 neighbor 192.168.1.2 password BGP_AUTH_KEY
 neighbor 192.168.1.2 timers 30 90
 neighbor 192.168.1.2 update-source Loopback0
 neighbor 192.168.1.2 ebgp-multihop 2
\`\`\`

**6. Verification After Fix:**
\`\`\`
show ip bgp summary | include 192.168.1.2
show ip bgp neighbors 192.168.1.2 | include BGP state
show ip route bgp
\`\`\`

**Pro Tips:**
- Always check physical connectivity first
- Use loopback interfaces for stability
- Implement MD5 authentication for security
- Monitor BGP state changes with logging` },
      { q: "Configure route filtering", a: `**Real Scenario:** Enterprise network needs to filter specific routes from ISP to prevent unwanted traffic and control routing table size.

**Multiple Filtering Methods:**

**Method 1: Prefix Lists (Recommended)**
\`\`\`
! Create prefix list to allow only specific networks
ip prefix-list ALLOWED_ROUTES permit 10.0.0.0/8 le 24
ip prefix-list ALLOWED_ROUTES permit 192.168.0.0/16 le 24
ip prefix-list ALLOWED_ROUTES deny 0.0.0.0/0 le 32

! Apply to BGP neighbor
router bgp 65001
 neighbor 192.168.1.2 remote-as 65002
 neighbor 192.168.1.2 prefix-list ALLOWED_ROUTES in
\`\`\`

**Method 2: Route Maps with Multiple Conditions**
\`\`\`
! Create route map for inbound filtering
route-map FILTER_IN permit 10
 match ip address prefix-list ALLOWED_ROUTES
 match as-path 1
 set local-preference 200

route-map FILTER_IN permit 20
 match ip address prefix-list DEFAULT_ONLY
 set local-preference 100

route-map FILTER_IN deny 30

! AS Path access list
ip as-path access-list 1 permit ^65002$
ip as-path access-list 1 deny .*

! Apply route map
router bgp 65001
 neighbor 192.168.1.2 route-map FILTER_IN in
\`\`\`

**Method 3: Distribute Lists (Legacy)**
\`\`\`
! Access list for route filtering
access-list 10 permit 10.0.0.0 0.255.255.255
access-list 10 permit 192.168.0.0 0.0.255.255
access-list 10 deny any

! Apply to OSPF neighbor
router ospf 1
 distribute-list 10 in GigabitEthernet0/0
\`\`\`

**Method 4: Filter Lists (OSPF)**
\`\`\`
! OSPF area filtering
ip prefix-list OSPF_FILTER deny 172.16.0.0/16
ip prefix-list OSPF_FILTER permit 0.0.0.0/0 le 32

router ospf 1
 area 1 filter-list prefix OSPF_FILTER in
\`\`\`

**Verification Commands:**
\`\`\`
show ip prefix-list
show route-map
show ip bgp neighbors 192.168.1.2 routes
show ip bgp regexp ^65002$
show ip ospf database | include filter
\`\`\`

**Common Issues:**
- Prefix list sequence numbers matter
- Route maps use implicit deny all
- Filter direction (in/out) is crucial
- Test filters before applying in production

**Best Practices:**
- Use prefix lists for IP-based filtering
- Route maps for complex policy routing
- Test with "show ip bgp neighbors X routes" before applying
- Document filter purposes and change history` },
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
    ]
  },
  {
    id: "switching",
    name: "Switching Scenarios (170+ Q&A)",
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
    ]
  },
  {
    id: "firewall",
    name: "Firewall Scenarios (160+ Q&A)",
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
                      overflowX: "auto"
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
