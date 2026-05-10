import { useState } from "react";

const VENDOR_INTERVIEW_CATEGORIES = [
  {
    id: "routing",
    name: "Routing Scenarios",
    icon: "🌐",
    color: "#3b82f6",
    questions: [
      {
        q: "How do you configure OSPF on a Cisco router for a multi-area network?",
        a: `Scenario: You're setting up OSPF in a large enterprise network with multiple areas to reduce LSA flooding and improve convergence.

Detailed Configuration:
1. Enable OSPF process: router ospf 1
2. Configure router ID: router-id 1.1.1.1
3. Define areas: network 192.168.1.0 0.0.0.255 area 0 (backbone)
4. Passive interfaces: passive-interface GigabitEthernet0/1 (for stub links)
5. Area types: area 1 stub (for leaf areas)
6. Authentication: area 0 authentication message-digest, ip ospf message-digest-key 1 md5 MyKey

Verification Commands:
- show ip ospf neighbor (check adjacencies)
- show ip ospf database (view LSAs)
- show ip route ospf (verify learned routes)

Troubleshooting: If routes aren't appearing, check area types, network statements, and ensure no mismatched authentication.`,
      },
      {
        q: "How do you troubleshoot BGP route advertisement issues on Juniper SRX?",
        a: `Scenario: Your BGP peer isn't receiving routes from your Juniper SRX firewall, causing connectivity issues.

Step-by-Step Troubleshooting:
1. Check BGP session: show bgp summary (look for Established state)
2. Verify route export: show route advertising-protocol bgp 192.168.1.2 (check what's being advertised)
3. Examine export policy: show policy-options policy-statement EXPORT-ROUTES (ensure it matches expected routes)
4. Check route table: show route protocol bgp (see received routes)
5. Debug BGP: set protocols bgp traceoptions file bgp-trace, then show log bgp-trace

Common Issues:
- Export policy not matching routes
- Next-hop self not configured
- AS path filtering blocking routes
- MTU mismatches causing session flaps

Fix: Adjust export policy or add next-hop-self to BGP group configuration.`,
      },
      {
        q: "How do you implement route redistribution between OSPF and EIGRP on Cisco IOS?",
        a: `Scenario: You're migrating from EIGRP to OSPF and need to redistribute routes during the transition.

Configuration Steps:
1. Enable both protocols:
   router eigrp 100
   network 10.0.0.0
   router ospf 1
   network 192.168.0.0 0.0.255.255 area 0

2. Configure redistribution:
   router ospf 1
   redistribute eigrp 100 subnets
   router eigrp 100
   redistribute ospf 1 metric 10000 100 255 1 1500

3. Prevent loops with route maps:
   route-map OSPF-TO-EIGRP deny 10
   match tag 100
   route-map OSPF-TO-EIGRP permit 20
   set tag 200

4. Apply route maps:
   router ospf 1
   redistribute eigrp 100 subnets route-map EIGRP-TO-OSPF
   router eigrp 100
   redistribute ospf 1 route-map OSPF-TO-EIGRP

Verification: show ip route (check for redistributed routes), debug ip routing (monitor redistribution).`,
      },
      {
        q: "How do you configure BGP route filtering on Palo Alto for security?",
        a: `Scenario: You need to filter BGP routes from an ISP to prevent unwanted prefixes and improve security.

Configuration:
1. Create prefix list: set network virtual-router default protocol bgp policy export rules ALLOW-VALID prefix-list VALID-PREFIXES
2. Define prefix list: set network virtual-router default protocol bgp policy prefix-list VALID-PREFIXES rules ALLOW-VALID action allow prefix 192.168.0.0/16
3. AS path filtering: set network virtual-router default protocol bgp policy as-path ACCESS-LIST rules ALLOW-VALID action allow regex ^65001$
4. Apply to BGP peer: set network virtual-router default protocol bgp peer-group ISP-PEERS policy export ALLOW-VALID

Verification: show routing protocol bgp loc-rib, show routing protocol bgp rib-out peer <peer-ip>

This prevents route leaks and ensures only authorized prefixes are accepted.`,
      },
      {
        q: "How do you set up static routing with failover on FortiGate?",
        a: `Scenario: Primary internet link fails, need automatic failover to backup link.

Configuration:
1. Configure interfaces: set ip 192.168.1.1 255.255.255.0, set allowaccess ping https
2. Static routes: config router static, edit 1, set device "wan1", set gateway 203.0.113.1, set distance 10
3. Backup route: edit 2, set device "wan2", set gateway 203.0.113.2, set distance 20
4. Link monitoring: config system link-monitor, edit "wan1-monitor", set srcintf "wan1", set server "8.8.8.8", set gateway-ip 203.0.113.1, set route "1"

When primary fails, FortiGate automatically switches to backup route with higher distance.`,
      },
      {
        q: "How do you implement VRF-lite for multi-tenant routing on Cisco Nexus?",
        a: `Scenario: Multiple customers share the same physical infrastructure but need isolated routing.

Steps:
1. Create VRFs: vrf context CUSTOMER-A, vrf context CUSTOMER-B
2. Assign interfaces: interface Ethernet1/1, vrf member CUSTOMER-A, ip address 10.1.1.1/24
3. Configure routing: router ospf 100 vrf CUSTOMER-A, network 10.1.1.0/24 area 0
4. Route leaking (if needed): ip route vrf CUSTOMER-A 192.168.1.0 255.255.255.0 Ethernet1/2 10.1.2.1 global
5. Verification: show vrf, show ip route vrf CUSTOMER-A

This provides logical separation while sharing physical resources.`,
      },
      {
        q: "How do you configure route maps for BGP policy control on Check Point?",
        a: `Scenario: You need to manipulate BGP attributes for traffic engineering.

Configuration:
1. Create route map: set bgp route-map EXPORT-MAP on
2. Match clauses: set bgp route-map EXPORT-MAP match ip address prefix-list MY-PREFIXES
3. Set clauses: set bgp route-map EXPORT-MAP set local-preference 200
4. Apply to peer: set bgp neighbor 192.168.1.2 route-map EXPORT-MAP out

This allows fine-grained control over route advertisement and path selection.`,
      },
      {
        q: "How do you troubleshoot routing loops in a RIP network on Cisco IOS?",
        a: `Scenario: Users report intermittent connectivity, suspect routing loop.

Diagnosis:
1. Check route table: show ip route rip (look for high hop counts)
2. Enable debugging: debug ip rip events
3. Check for split horizon: show running-config | include split-horizon
4. Verify timers: show ip protocols (RIP timers should match)
5. Packet capture: debug ip rip (capture RIP updates)

Common causes: mismatched timers, disabled split horizon, network statement errors.

Fix: Ensure consistent configuration across all routers, enable split horizon where appropriate.`,
      },
      {
        q: "How do you implement MPLS L3VPN on Juniper MX?",
        a: `Scenario: Provide VPN services to customers with overlapping IP addresses.

Configuration:
1. Configure MPLS: set protocols mpls interface ge-0/0/0.0
2. LDP: set protocols ldp interface ge-0/0/0.0
3. VRF: set routing-instances CUSTOMER-A instance-type vrf, set interface ge-0/1/0.100
4. Route targets: set routing-instances CUSTOMER-A vrf-target target:65001:100
5. BGP: set protocols bgp group PEERS neighbor 192.168.1.2 family inet-vpn unicast

This creates isolated routing domains with MPLS transport.`,
      },
      {
        q: "How do you configure route summarization on Huawei routers?",
        a: `Scenario: Reduce routing table size and improve convergence in a large network.

Configuration:
1. OSPF summarization: ospf 1, area 0.0.0.0, abr-summary 192.168.0.0 255.255.252.0
2. BGP summarization: bgp 65001, aggregate 10.0.0.0 255.255.0.0 detail-suppressed
3. Static route summarization: ip route-static 0.0.0.0 0.0.0.0 192.168.1.1 preference 60

Verification: display ip routing-table, display bgp routing-table

This reduces LSA/BGP update overhead and improves network stability.`,
      },
    ],
  },
  {
    id: "switching",
    name: "Switching Scenarios",
    icon: "🔀",
    color: "#10b981",
    questions: [
      {
        q: "How do you configure VLAN trunking and access ports on Cisco Catalyst?",
        a: `Scenario: Setting up a multi-VLAN network with trunk links between switches.

Configuration:
1. Create VLANs: vlan 10, name SALES, vlan 20, name ENGINEERING
2. Configure access port: interface GigabitEthernet0/1, switchport mode access, switchport access vlan 10
3. Configure trunk port: interface GigabitEthernet0/24, switchport mode trunk, switchport trunk allowed vlan 10,20
4. Set native VLAN: switchport trunk native vlan 1
5. Enable DTP: switchport nonegotiate (for security)

Verification: show vlan brief, show interfaces trunk

This ensures proper VLAN segregation and trunk operation.`,
      },
      {
        q: "How do you troubleshoot STP loops on Juniper EX switches?",
        a: `Scenario: Network slowdowns indicate a spanning tree loop.

Troubleshooting Steps:
1. Check STP status: show spanning-tree bridge
2. Identify root bridge: show spanning-tree interface
3. Look for multiple paths: show spanning-tree msti 0
4. BPDU debugging: monitor traffic interface ge-0/0/0 matching "ether[0] & 1 != 0"
5. Port states: show interfaces ge-0/0/0 extensive | match "STP state"

Common issues: misconfigured port priorities, duplicate root bridges, unidirectional links.

Fix: Adjust bridge priorities or enable BPDU guard on edge ports.`,
      },
      {
        q: "How do you implement EtherChannel/LACP on Cisco Nexus for redundancy?",
        a: `Scenario: Link aggregation for high availability and bandwidth.

Configuration:
1. Create port-channel: interface port-channel 10
2. Configure member interfaces: interface Ethernet1/1, channel-group 10 mode active
3. Set LACP: lacp mode active, lacp rate fast
4. VLAN configuration: switchport mode trunk, switchport trunk allowed vlan 10-20
5. Load balancing: port-channel load-balance src-dst-ip

Verification: show port-channel summary, show lacp interfaces

This provides link redundancy and increased bandwidth.`,
      },
      {
        q: "How do you configure QinQ tunneling on Huawei switches?",
        a: `Scenario: Service provider needs to transport customer VLANs transparently.

Configuration:
1. Enable QinQ: interface GigabitEthernet0/0/1, port link-type hybrid, port hybrid tagged vlan 100
2. Configure outer tag: qinq vlan-translation enable, qinq vlan-translation vlan 100 map-vlan 200 to 210
3. Inner VLAN handling: port hybrid untagged vlan 200 to 210

Verification: display vlan, display interface GigabitEthernet 0/0/1

This allows multiple customers to use overlapping VLAN IDs.`,
      },
      {
        q: "How do you implement port security on Aruba switches?",
        a: `Scenario: Prevent unauthorized devices and MAC address flooding.

Configuration:
1. Enable port security: interface 1, port-security
2. Set max MACs: port-security max-mac-count 2
3. Violation action: port-security violation restrict
4. Sticky learning: port-security mac-address sticky
5. Aging: port-security aging-time 1440

Verification: show port-security, show mac-address-table

This enhances network security at the access layer.`,
      },
      {
        q: "How do you configure MLAG on Juniper EX switches?",
        a: `Scenario: Multi-chassis link aggregation for active-active redundancy.

Configuration:
1. ICCP: set protocols iccp local-ip-addr 192.168.1.1, set protocols iccp peer 192.168.1.2
2. MC-LAG: set interfaces ae0 mc-ae mc-ae-id 1, set interfaces ae0 mc-ae chassis-id 1
3. Status control: set interfaces ae0 mc-ae status-control active
4. LACP: set interfaces ae0 aggregated-ether-options lacp active

Verification: show interfaces mc-ae, show iccp

This eliminates STP blocking and provides full bandwidth utilization.`,
      },
      {
        q: "How do you troubleshoot VLAN connectivity issues on Cisco Catalyst?",
        a: `Scenario: Devices in same VLAN can't communicate.

Troubleshooting:
1. Check VLAN membership: show vlan id 10
2. Verify trunk status: show interfaces trunk
3. Check VTP status: show vtp status
4. Native VLAN mismatch: show interfaces gi0/1 switchport
5. STP blocking: show spanning-tree vlan 10
6. ARP issues: show arp | include vlan10

Common fixes: correct VLAN assignments, ensure trunks allow VLAN, check STP topology.`,
      },
      {
        q: "How do you implement VXLAN on Cisco Nexus?",
        a: `Scenario: Extend Layer 2 domains across data centers.

Configuration:
1. Enable VXLAN: feature vn-segment-vlan-based
2. Create VNI: vlan 100, vn-segment 10000
3. Configure VTEP: interface nve1, member vni 10000, ingress-replication protocol bgp
4. BGP EVPN: router bgp 65001, address-family l2vpn evpn, advertise l2vpn evpn

Verification: show nve vni, show bgp l2vpn evpn

This enables Layer 2 connectivity over Layer 3 networks.`,
      },
      {
        q: "How do you configure PoE on HPE Aruba switches?",
        a: `Scenario: Power IP phones and access points.

Configuration:
1. Enable PoE: interface 1, poe
2. Set power limit: poe max-power 30
3. Priority: poe priority critical
4. LLDP: lldp enable, lldp med

Verification: show power-over-ethernet, show lldp info remote-device

This provides power and data over single cable.`,
      },
      {
        q: "How do you implement MACsec on Cisco Catalyst for link security?",
        a: `Scenario: Encrypt traffic on trunk links between switches.

Configuration:
1. Enable MACsec: macsec
2. Configure key chain: key chain MACSEC-KEY, key 1, cryptographic-algorithm aes-128-cmac, key-string MyKey123
3. Apply to interface: interface GigabitEthernet0/1, macsec, macsec key-source static key-chain MACSEC-KEY
4. Cipher suite: macsec cipher-suite GCM-AES-128

Verification: show macsec summary, show macsec statistics

This provides hop-by-hop encryption for sensitive traffic.`,
      },
    ],
  },
  {
    id: "firewall",
    name: "Firewall Scenarios",
    icon: "🛡️",
    color: "#f59e0b",
    questions: [
      {
        q: "How do you configure a DMZ with NAT on Cisco ASA?",
        a: `Scenario: Secure web server in DMZ with public access.

Configuration:
1. Interfaces: interface GigabitEthernet0/0, nameif outside, security-level 0, ip address 203.0.113.1 255.255.255.0
2. DMZ interface: interface GigabitEthernet0/1, nameif dmz, security-level 50, ip address 192.168.1.1 255.255.255.0
3. NAT: object network WEB-SERVER, host 192.168.1.100, nat (dmz,outside) static 203.0.113.10
4. ACL: access-list OUTSIDE_IN extended permit tcp any host 203.0.113.10 eq 443
5. Apply ACL: access-group OUTSIDE_IN in interface outside

Verification: show nat, show access-list, packet-tracer input outside tcp 1.2.3.4 1024 203.0.113.10 443

This provides secure public access to internal resources.`,
      },
      {
        q: "How do you troubleshoot VPN tunnel issues on FortiGate?",
        a: `Scenario: IPsec tunnel between sites is down.

Troubleshooting:
1. Check tunnel status: get vpn ipsec tunnel summary
2. Phase 1: diagnose vpn ike log-filter dst-addr 203.0.113.1
3. Phase 2: diagnose vpn tunnel list
4. Routing: get router info routing-table | grep 10.0.2.0
5. Debug: diagnose debug application ike -1, diagnose debug enable

Common issues: PSK mismatch, policy mismatch, NAT-T problems.

Fix: Verify configurations match, check for NAT devices in path.`,
      },
      {
        q: "How do you implement application control on Palo Alto?",
        a: `Scenario: Block social media but allow business applications.

Configuration:
1. Create policy: set rulebase security rules BLOCK-SOCIAL from trust to untrust source any destination any application facebook action deny
2. App groups: set rulebase security rules ALLOW-BUSINESS from trust to untrust source any destination any application business-apps action allow
3. Custom apps: set objects custom-objects application MyApp signature "HTTP/1.1 200 OK" category business
4. Profile: set profiles security profile-group BUSINESS-PROFILE application ALLOW-BUSINESS

Verification: show session all filter application eq facebook, check Traffic logs

This provides granular application-level control.`,
      },
      {
        q: "How do you configure zone-based firewall on Cisco IOS XE?",
        a: `Scenario: Segment network with security zones.

Configuration:
1. Create zones: zone security INSIDE, zone security OUTSIDE
2. Zone pair: zone-pair security IN-TO-OUT source INSIDE destination OUTSIDE
3. Class map: class-map type inspect match-any HTTP, match protocol http
4. Policy map: policy-map type inspect IN-TO-OUT, class HTTP, inspect
5. Apply: interface GigabitEthernet0/0, zone-member security INSIDE

Verification: show zone-pair security, show policy-map type inspect

This provides stateful inspection between zones.`,
      },
      {
        q: "How do you implement SSL decryption on Juniper SRX?",
        a: `Scenario: Inspect encrypted traffic for threats.

Configuration:
1. Create profile: set security idp ssl-inspection SSL-PROFILE
2. Certificate: set security pki local-certificate SSL-INSPECT key-pair SSL-KEY
3. Policy: set security policies from-zone trust to-zone untrust policy DECRYPT match source-address any destination-address any application any then permit ssl-proxy SSL-PROFILE
4. Root CA: set security pki ca-profile ROOT-CA ca-identity ROOT-CA

Verification: show security pki local-certificate, show security policies hit-count

This enables deep inspection of encrypted traffic.`,
      },
      {
        q: "How do you configure user-based policies on Check Point?",
        a: `Scenario: Different access rules for employees vs contractors.

Configuration:
1. Create users/groups: add user contractor, add group CONTRACTORS
2. Access role: add access-role CONTRACTOR-ROLE users CONTRACTORS
3. Rule: add rule layer Network position 1 source CONTRACTOR-ROLE destination DMZ-SERVERS service HTTP action Accept
4. Identity awareness: set identity-awareness blade on, set identity-awareness ad-query on

Verification: show user-group, show access-rule layer Network

This provides role-based access control.`,
      },
      {
        q: "How do you implement threat prevention on SonicWall?",
        a: `Scenario: Protect against malware and intrusions.

Configuration:
1. Enable services: set intrusion-prevention, set gateway-antivirus
2. Profiles: set intrusion-prevention profile HIGH-SECURITY
3. Rules: set firewall policy from LAN to WAN source any destination any service any action allow dpi HIGH-SECURITY
4. SSL inspection: set ssl-control-inspection

Verification: show intrusion-prevention statistics, show gateway-antivirus statistics

This provides comprehensive threat protection.`,
      },
      {
        q: "How do you configure high availability on Sophos XG?",
        a: `Scenario: Redundant firewall deployment.

Configuration:
1. HA setup: set ha mode active-passive, set ha priority 100
2. Interfaces: set ha port-a GigabitEthernet0/0, set ha port-b GigabitEthernet0/1
3. Synchronization: set ha sync-interfaces, set ha sync-rules
4. Monitoring: set ha monitor-interfaces GigabitEthernet0/2

Verification: show ha status, show ha statistics

This ensures continuous service availability.`,
      },
      {
        q: "How do you implement URL filtering on FortiGate?",
        a: `Scenario: Block malicious websites and restrict access.

Configuration:
1. Create profile: config webfilter profile, edit "STRICT-FILTER", set web-content-filter enable
2. Categories: set web-content-filter categories 1 2 3 action block
3. Override: set web-content-filter override enable
4. Apply: config firewall policy, edit 10, set webfilter-profile "STRICT-FILTER"

Verification: diagnose webfilter cache list, show webfilter statistics

This controls web access based on content categories.`,
      },
      {
        q: "How do you configure application-aware routing on Palo Alto?",
        a: `Scenario: Route different applications through different ISPs.

Configuration:
1. Create PBF rule: set rulebase pbf rules ROUTE-VOIP from trust to untrust source any destination any application skype action forward-to isp2
2. Service-based: set rulebase pbf rules ROUTE-HTTP from trust to untrust source any destination any service http action forward-to isp1
3. Monitoring: set rulebase pbf rules MONITOR from trust to untrust source any destination any application any action forward-to isp1 monitor

Verification: show pbf rule hit-count, show routing fib

This enables intelligent traffic steering based on applications.`,
      },
    ],
  },
];

export default function VendorInterviewQuestions() {
  const [selectedCategory, setSelectedCategory] = useState(VENDOR_INTERVIEW_CATEGORIES[0].id);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);

  const category = VENDOR_INTERVIEW_CATEGORIES.find((c) => c.id === selectedCategory);
  const filteredQuestions = category.questions.filter(
    (q) =>
      q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
        color: "#e2e8f0",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "32px 40px",
          borderBottom: "1px solid #374151",
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
            <span style={{ fontSize: "36px" }}>🔧</span>
            <div>
              <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 800 }}>Vendor Interview Prep</h1>
              <p style={{ margin: "6px 0 0", color: "#94a3b8", fontSize: "16px" }}>
                Detailed Q&A with scenario-based examples • {VENDOR_INTERVIEW_CATEGORIES.reduce((sum, cat) => sum + cat.questions.length, 0)} questions
              </p>
            </div>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search questions and answers..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setExpandedIndex(null);
            }}
            style={{
              width: "100%",
              padding: "14px 18px",
              background: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "10px",
              color: "#e2e8f0",
              fontSize: "15px",
              outline: "none",
              transition: "all 0.2s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#3b82f6";
              e.target.style.background = "#0f172a";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#475569";
              e.target.style.background = "#1e293b";
            }}
          />
        </div>
      </div>

      {/* Main */}
      <div style={{ display: "flex", maxWidth: "1600px", margin: "0 auto" }}>
        {/* Categories sidebar */}
        <div
          style={{
            width: "280px",
            borderRight: "1px solid #374151",
            padding: "24px 16px",
            overflowY: "auto",
            maxHeight: "calc(100vh - 140px)",
          }}
        >
          {VENDOR_INTERVIEW_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSearchTerm("");
                setExpandedIndex(null);
              }}
              style={{
                width: "100%",
                padding: "14px 16px",
                marginBottom: "10px",
                background: selectedCategory === cat.id ? "#1e293b" : "transparent",
                border: `1px solid ${selectedCategory === cat.id ? cat.color + "66" : "transparent"}`,
                borderLeft: selectedCategory === cat.id ? `4px solid ${cat.color}` : "4px solid transparent",
                borderRadius: "8px",
                color: selectedCategory === cat.id ? "#f1f5f9" : "#94a3b8",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "14px",
                fontWeight: 600,
                transition: "all 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "18px" }}>{cat.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {cat.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                    {cat.questions.length} scenarios
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Questions */}
        <div style={{ flex: 1, padding: "32px 40px", overflowY: "auto", maxHeight: "calc(100vh - 140px)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "28px",
            }}
          >
            <span style={{ fontSize: "28px" }}>{category.icon}</span>
            <div>
              <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700 }}>{category.name}</h2>
              <p style={{ margin: "6px 0 0", color: "#94a3b8", fontSize: "14px" }}>
                {filteredQuestions.length} of {category.questions.length} detailed scenarios
                {searchTerm && ` (filtered)`}
              </p>
            </div>
          </div>

          {filteredQuestions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px", color: "#64748b" }}>
              <div style={{ fontSize: "56px", marginBottom: "20px" }}>🔍</div>
              <p style={{ margin: 0, fontSize: "18px" }}>No scenarios match your search.</p>
            </div>
          ) : (
            filteredQuestions.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                style={{
                  background: expandedIndex === idx ? "#1e293b" : "#0f172a",
                  border: `1px solid ${expandedIndex === idx ? "#475569" : "#374151"}`,
                  borderRadius: "12px",
                  marginBottom: "16px",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
              >
                {/* Question */}
                <div
                  style={{
                    padding: "20px 24px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: category.color + "33",
                      border: `2px solid ${category.color}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: 800,
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
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#e2e8f0",
                        lineHeight: "1.6",
                      }}
                    >
                      {item.q}
                    </p>
                  </div>
                  <span style={{ color: "#64748b", fontSize: "18px", flexShrink: 0 }}>
                    {expandedIndex === idx ? "▲" : "▼"}
                  </span>
                </div>

                {/* Answer */}
                {expandedIndex === idx && (
                  <div
                    style={{
                      borderTop: "1px solid #374151",
                      padding: "20px 24px",
                      background: "#0f172a",
                      display: "flex",
                      gap: "16px",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "#10b98133",
                        border: "2px solid #10b981",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: 800,
                        color: "#10b981",
                        flexShrink: 0,
                      }}
                    >
                      A
                    </div>
                    <div
                      style={{
                        flex: 1,
                        fontSize: "14px",
                        color: "#cbd5e1",
                        lineHeight: "1.8",
                        whiteSpace: "pre-wrap",
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
    </div>
  );
}</content>
<parameter name="filePath">/Users/shaiksameer/my-react-app/src/vendorInterviewQuestions.jsx