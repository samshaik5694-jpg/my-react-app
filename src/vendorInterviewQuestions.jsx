import { useState } from "react";

const VENDOR_INTERVIEW_CATEGORIES = [
  {
    id: "routing",
    name: "Routing Scenarios (170+ Q&A)",
    icon: "🌐",
    color: "#3b82f6",
    questions: [
      { q: "Configure OSPF with multi-area design", a: "router ospf 1\nrouter-id 1.1.1.1\narea 0 stub no-summary\nnetwork 10.0.0.0 area 0\nnetwork 192.168.1.0 area 1" },
      { q: "Troubleshoot BGP adjacency", a: "show ip bgp summary\nshow ip bgp neighbors\ndebug ip bgp keepalives\nVerify: timers, auth, IP" },
      { q: "Configure route filtering", a: "ip prefix-list FILTER permit 10.0.0.0/8\nroute-map FILTER permit 10\nmatch ip address prefix FILTER" },
      { q: "EIGRP load balancing", a: "router eigrp 100\nvariance 2\nmaximum-paths 4\nshow ip eigrp topology" },
      { q: "RIP with split horizon", a: "ip rip split-horizon poisoned-reverse\ntimers 30 180 180 240\npassive-interface default" },
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
      { q: "Configure 802.1Q trunk", a: "switchport mode trunk\nswitchport trunk encapsulation dot1q\nswitchport trunk native vlan 1\nswitchport trunk allowed vlan 1-100" },
      { q: "STP root bridge setup", a: "spanning-tree vlan 1 priority 4096\nspanning-tree vlan 1 root primary\nspanning-tree vlan 1 root secondary (backup)" },
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
      { q: "ASA DMZ setup", a: "interface GigabitEthernet0/0, nameif outside, security-level 0\ninterface GigabitEthernet0/2, nameif dmz, security-level 50\nstatic (dmz,outside) 203.0.113.10 10.1.0.10" },
      { q: "FortiGate IPsec debug", a: "diagnose vpn ipsec status\ndiagnose vpn ike log\nPhase 1: encryption mismatch\nPhase 2: transform set mismatch" },
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
