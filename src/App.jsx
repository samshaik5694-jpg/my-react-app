import { useState } from "react";

const scenarios = [
  {
    id: 0,
    title: "Architecture Overview",
    icon: "🏗️",
    color: "#00d4ff",
    description: "Understand the stack before touching anything.",
    commands: [],
    concepts: [
      {
        title: "The Dependency Chain (Memorize This)",
        body: "Ceph MON/MDS → CephFS Mount (/mnt/cephfs) → pacemaker.path watches /mnt/cephfs/virtualmachines/ → pacemaker.service starts → Hydra VMs come up.\n\nIf ANY link breaks, everything below it goes dark. One rebooted node with missing iptables rules = 5-hour outage.",
      },
      {
        title: "What is Ceph?",
        body: "Distributed storage system running across all 4 hypervisors (q1s1–q1s4). It provides the shared filesystem (CephFS) that all VMs boot from. 12 OSDs total — 3 per node, 1 per physical disk.",
      },
      {
        title: "What is Pacemaker?",
        body: "High-availability cluster manager. It watches for /mnt/cephfs/virtualmachines/ to exist. The moment CephFS unmounts — pacemaker stops, and all retail VMs (SCCM DP, file server, KRS, R10) go down.",
      },
      {
        title: "What is Netkicker?",
        body: "A cron-based auto-healer. Tries to restart failed Ceph services automatically. If you see Netkicker restarting the same service repeatedly, that means there's a deeper problem Netkicker can't fix on its own.",
      },
    ],
  },
  {
    id: 1,
    title: "Scenario 1 – CephFS Mount Failure",
    icon: "💾",
    color: "#ff6b6b",
    description: "Most impactful failure. CephFS down = all VMs down.",
    commands: [
      {
        cmd: "mount | grep cephfs",
        why: "First thing you check. If CephFS isn't mounted, nothing below it (pacemaker, VMs) will work. This tells you instantly whether /mnt/cephfs/ is mounted or not.",
        fixes: "Confirms the root cause. If empty output — CephFS is down and that's why VMs are inaccessible.",
        tag: "DIAGNOSE",
      },
      {
        cmd: "sudo systemctl status mnt-cephfs.mount",
        why: "Checks the systemd mount unit that manages the CephFS mount. Tells you if the unit failed, is inactive, or is in a retry loop.",
        fixes: "Reveals whether the mount unit itself is broken or if it never started.",
        tag: "DIAGNOSE",
      },
      {
        cmd: "sudo ceph status",
        why: "Before you try to remount CephFS, you MUST verify Ceph is healthy. Mounting CephFS requires working MON (monitors) and MDS. Trying to mount against a broken cluster will just hang.",
        fixes: "Gates you from wasting time on a remount attempt when the underlying cluster is the real problem.",
        tag: "DIAGNOSE",
      },
      {
        cmd: "sudo systemctl start mnt-cephfs.mount",
        why: "The actual fix attempt. Once you've confirmed Ceph is healthy, you trigger the systemd unit to mount CephFS. pacemaker.path is watching — the moment /mnt/cephfs/virtualmachines/ appears, pacemaker auto-starts.",
        fixes: "Re-establishes the CephFS mount, which cascades: pacemaker starts → VMs come back up.",
        tag: "FIX",
      },
      {
        cmd: "ls /mnt/cephfs/",
        why: "Verify the mount actually worked. A successful mount shows directories: iso/, virtualmachines/, templates/. An empty output means the mount silently failed.",
        fixes: "Confirms CephFS is truly mounted and accessible, not just that the systemd unit reported success.",
        tag: "VERIFY",
      },
      {
        cmd: "sudo systemctl status pacemaker.path\nsudo systemctl status pacemaker\nsudo pcs cluster status",
        why: "After CephFS mounts, check if pacemaker auto-recovered. pacemaker.path is the watchdog — it should detect /mnt/cephfs/virtualmachines/ and start pacemaker automatically. If it didn't, you start it manually.",
        fixes: "Confirms the cascade recovery worked. If pacemaker didn't auto-start, you catch it here before declaring victory.",
        tag: "VERIFY",
      },
      {
        cmd: "sudo virsh list --all",
        why: "Final check. Lists all VMs and their state. You want to see 'running' next to all Hydra VMs (SCCM DP, file server, KRS, R10). Any showing 'shut off' need a manual start.",
        fixes: "Confirms VMs recovered. Any shut-off VMs are started with: sudo virsh start <vm_name>",
        tag: "VERIFY",
      },
    ],
  },
  {
    id: 2,
    title: "Scenario 2 – VM Issues After Ceph Recovery",
    icon: "🖥️",
    color: "#ffa94d",
    description: "Ceph is healthy but VMs still won't come back.",
    commands: [
      {
        cmd: "sudo systemctl status libvirtd",
        why: "libvirtd is the daemon that manages VMs. Even if CephFS is mounted and pacemaker is running, VMs can't start if libvirtd is down. This is a common post-recovery miss.",
        fixes: "Identifies if libvirtd is the blocker. If it's failed: sudo systemctl start libvirtd",
        tag: "DIAGNOSE",
      },
      {
        cmd: "sudo virsh list --all",
        why: "Comprehensive view of all VM states. Shows which VMs are running, shut off, or paused. This is your hit list — anything not 'running' needs attention.",
        fixes: "Gives you the exact list of VMs to manually start.",
        tag: "DIAGNOSE",
      },
      {
        cmd: "ls -lh /mnt/cephfs/virtualmachines/<vm_name>*.raw",
        why: "If a VM fails to start, check if its disk image actually exists on CephFS. VMs can fail silently if the .raw disk file is missing — maybe it was never created, or CephFS had data loss.",
        fixes: "Rules out missing disk image as the cause. If the file is gone, the VM needs to be recreated from scripts in /root/hydra/.",
        tag: "DIAGNOSE",
      },
      {
        cmd: "sudo virsh define /mnt/cephfs/templates/<vm_name>.xml\nsudo virsh autostart <vm_name>\nsudo virsh start <vm_name>",
        why: "If the VM definition was lost (virsh doesn't know about the VM at all), you redefine it from the XML template stored on CephFS. autostart ensures it survives future reboots.",
        fixes: "Recreates the VM definition and starts the VM without needing to rebuild the disk image.",
        tag: "FIX",
      },
    ],
  },
  {
    id: 3,
    title: "Scenario 3 – Services Down, No Hardware Failure",
    icon: "⚙️",
    color: "#69db7c",
    description: "Ceph daemons are down but disks and nodes are fine.",
    commands: [
      {
        cmd: "sudo systemctl status ceph-mon@$(hostname)\nsudo systemctl status ceph-mgr@$(hostname)\nsudo systemctl status ceph-osd*\nsudo systemctl status ceph-mds@$(hostname)\nsudo systemctl status mnt-cephfs.mount",
        why: "Checks every Ceph service at once. $(hostname) auto-fills your current node name. This tells you exactly which daemon(s) died and whether it's one or all of them.",
        fixes: "Identifies precisely which services to restart and in what order (MON → MGR → MDS → OSD).",
        tag: "DIAGNOSE",
      },
      {
        cmd: "sudo systemctl start ceph-mon@$(hostname)\nsudo systemctl start ceph-mgr@$(hostname)\nsudo systemctl start ceph-mds@$(hostname)",
        why: "Manual restart of the Ceph control plane daemons. You restart MON first because everything depends on quorum. MGR and MDS follow. Netkicker should do this automatically but if it's not working, you do it manually.",
        fixes: "Brings the Ceph control plane back online, which then allows CephFS to mount and pacemaker to start.",
        tag: "FIX",
      },
      {
        cmd: "sudo systemctl start ceph-osd@<OSD_NUM>",
        why: "Restarts a specific OSD (data daemon). You need the OSD number from 'ceph osd tree'. Each OSD = one physical disk. If multiple OSDs are down on one node, restart each individually.",
        fixes: "Brings data OSDs back online. Ceph needs OSDs for data redundancy and IO.",
        tag: "FIX",
      },
      {
        cmd: "journalctl -u ceph-mon@$(hostname) --since \"1 hour ago\"\njournalctl -u ceph-osd@<OSD_NUM> --since \"1 hour ago\"",
        why: "When a service won't stay up, logs tell you why. Look for authentication errors (Kerberos/cephx), I/O errors (bad disk), or network errors (can't reach peers). This is the difference between guessing and knowing.",
        fixes: "Reveals the root cause so you fix the right thing — not just restart and hope.",
        tag: "DIAGNOSE",
      },
      {
        cmd: "sudo systemctl reset-failed ceph-osd@<OSD_NUM>\nsudo systemctl start ceph-osd@<OSD_NUM>",
        why: "systemd has a start-limit: if a service fails too many times, it stops trying and enters 'start-limit' state. reset-failed clears that counter so you can attempt a restart again.",
        fixes: "Unblocks restart attempts on an OSD that systemd gave up on. If it fails again after this, the disk is likely physically bad.",
        tag: "FIX",
      },
    ],
  },
  {
    id: 4,
    title: "Scenario 4 – Post-Reboot / Power Event",
    icon: "⚡",
    color: "#f06595",
    description: "After a reboot, Ceph hangs and VMs won't start. Root cause: iptables rules didn't survive the reboot.",
    commands: [
      {
        cmd: "sudo salt '<site>-q1s*' cmd.run 'uptime'",
        why: "Run this first on all hypervisors simultaneously. Low uptime on all 4 = site-wide power event. Low uptime on just one = that node rebooted. This determines your scope — fix one node vs fix all four.",
        fixes: "Scopes the incident before you start fixing things in the wrong order.",
        tag: "DIAGNOSE",
      },
      {
        cmd: "sudo iptables -L INPUT -n -v | grep <peer_hypervisor_IP>",
        why: "THE most important check after a reboot. Ceph nodes need to talk to each other over the network. iptables controls that. After a reboot, the rules may not have persisted. Missing ACCEPT rules = nodes can't communicate = Ceph loses quorum = everything dies.",
        fixes: "Identifies if missing iptables rules are the root cause (they usually are in this scenario).",
        tag: "DIAGNOSE",
      },
      {
        cmd: "sudo salt '<site>-q1s*' mine.flush\nsudo salt '<site>-q1s*' mine.update\nsudo salt '<site>-q1s*' state.apply sites.common_states.sshd,sites.snp.role_states.hypervisor.hosts,sites.snp.role_states.hypervisor.iptables --state-verbose=false --state-output=terse",
        why: "This is the actual fix. Salt manages iptables rules dynamically from 'mine' data (which stores each node's IP). Flush+update refreshes that data first, then state.apply pushes fresh iptables rules AND SSH config to all nodes simultaneously.",
        fixes: "Restores inter-hypervisor communication rules. Ceph nodes can talk again → quorum re-forms → CephFS mounts → pacemaker starts → VMs come up.",
        tag: "FIX",
      },
      {
        cmd: "sudo ceph status",
        why: "After restoring iptables, Ceph should self-heal. Monitor this. You want to see the monitor count increase, OSDs come back, and health move toward HEALTH_OK. Netkicker will restart any services that are still down.",
        fixes: "Confirms Ceph recovered. HEALTH_WARN during rebalancing is normal and not a problem.",
        tag: "VERIFY",
      },
      {
        cmd: "sudo salt '<site>-q1s*' cmd.run 'systemctl restart ceph.target'",
        why: "If Ceph is still not responding 5 minutes after fixing iptables, this restarts ALL Ceph services on all nodes at once via the ceph.target umbrella unit. Use this as a last resort before deeper investigation.",
        fixes: "Force-restarts the entire Ceph stack when individual service restarts aren't enough.",
        tag: "FIX",
      },
    ],
  },
  {
    id: 5,
    title: "Scenario 5 – SSH / Firewall Between Hypervisors",
    icon: "🔒",
    color: "#cc5de8",
    description: "Ceph nodes can't reach each other. iptables or SSHD config is broken.",
    commands: [
      {
        cmd: "sudo iptables -L INPUT -n -v | grep <peer_IP>",
        why: "Verifies Layer 1 — whether the firewall allows traffic from peer hypervisors at all. You should see an ACCEPT rule for each of the other 3 nodes' management IPs. Missing = they're blocked.",
        fixes: "Confirms iptables is the blocker. Without this rule, ALL Ceph traffic (not just SSH) between nodes is dropped.",
        tag: "DIAGNOSE",
      },
      {
        cmd: "sudo grep -A2 \"Match Address\" /etc/ssh/sshd_config",
        why: "Verifies Layer 2 — whether SSHD allows root login from peer nodes. Ceph uses root SSH for cluster operations. If the Match Address block is missing for a peer, root SSH from that peer will be rejected even if iptables allows it.",
        fixes: "Identifies missing SSHD peer config as the cause of SSH failures.",
        tag: "DIAGNOSE",
      },
      {
        cmd: "sudo salt <site>-q1s* mine.get hypervisor_mgmt_interface",
        why: "Checks what IP data Salt currently knows about for each hypervisor. Both iptables rules and SSHD configs are generated FROM this mine data. If mine data is stale or missing a node, the rules won't include that node's IP.",
        fixes: "Identifies stale mine data as the root cause of missing rules.",
        tag: "DIAGNOSE",
      },
      {
        cmd: "sudo salt <site>-q1s* mine.flush\nsudo salt <site>-q1s* mine.update",
        why: "Refreshes Salt's mine data — the source of truth for hypervisor IPs used in iptables and SSHD generation. flush wipes old data, update re-populates from each minion. Always do this before re-applying states.",
        fixes: "Ensures the subsequent state.apply generates rules with correct, current IPs.",
        tag: "FIX",
      },
      {
        cmd: "ssh root@<site>-q1s1\nssh root@<site>-q1s2\nssh root@<site>-q1s3\nssh root@<site>-q1s4",
        why: "The definitive connectivity test. From any hypervisor, try SSH to all other three. Success = inter-hypervisor SSH is working. Failure = trace back through iptables → SSHD config → mine data layers.",
        fixes: "End-to-end test that confirms all three layers (iptables, SSHD, mine data) are correct.",
        tag: "VERIFY",
      },
    ],
  },
  {
    id: 6,
    title: "Scenario 6 – Node Removed from Pacemaker",
    icon: "🔗",
    color: "#20c997",
    description: "One node is isolated — CephFS not mounted, VMs not running, but Ceph itself is healthy.",
    commands: [
      {
        cmd: "sudo salt '<site>-q1s<N>' cmd.run 'mount | grep cephfs'",
        why: "Step one: confirm CephFS isn't mounted on the isolated node. Empty output confirms the mount is missing — which is why FIS sees 'ISOs not found' when trying to work on that specific node.",
        fixes: "Confirms CephFS mount as the immediate problem to fix before touching pacemaker.",
        tag: "DIAGNOSE",
      },
      {
        cmd: "sudo salt '<site>-q1s1' cmd.run 'pcs status'\nsudo salt '<site>-q1s1' cmd.run 'cat /etc/corosync/corosync.conf | grep -A3 \"node {\"'",
        why: "Run FROM a working node. pcs status shows whether the affected node appears in the cluster at all. The corosync.conf check shows whether it's even listed. If it's not in corosync.conf, it was removed from the cluster — that's why nothing works on it.",
        fixes: "Distinguishes between 'node is listed but offline' (just needs pcs cluster start) vs 'node was fully removed' (needs the full rejoin procedure).",
        tag: "DIAGNOSE",
      },
      {
        cmd: "sudo salt '<site>-q1s<N>' cmd.run 'pcs cluster stop'\nsudo salt '<site>-q1s<N>' cmd.run 'pcs cluster destroy'",
        why: "On the isolated node — destroys the stale pacemaker/corosync state that was left behind when the node was removed. You can't re-add a node with leftover config from when it was last in the cluster.",
        fixes: "Cleans the slate so the node can be freshly re-added to the cluster.",
        tag: "FIX",
      },
      {
        cmd: "sudo salt -L '<site>-q1s1,<site>-q1s2,<site>-q1s3,<site>-q1s4' cmd.run 'echo \"hacluster:<password>\" | chpasswd'",
        why: "Sets the hacluster user password on ALL nodes to the same value. pcs uses hacluster credentials to authenticate nodes to each other during the join process. Mismatched passwords = authentication failure.",
        fixes: "Ensures all nodes share the same hacluster password before the auth step.",
        tag: "FIX",
      },
      {
        cmd: "sudo salt '<site>-q1s1' cmd.run 'pcs cluster auth <site>-q1s1 <site>-q1s2 <site>-q1s3 <site>-q1s4 -u hacluster -p <password>'",
        why: "Authenticates all nodes to each other using the hacluster credentials. This is the handshake that allows pcs to manage the cluster across all 4 nodes. Must show 'Authorized' for each node.",
        fixes: "Establishes mutual trust between all cluster nodes — required before the re-add step.",
        tag: "FIX",
      },
      {
        cmd: "sudo salt '<site>-q1s1' cmd.run 'pcs cluster node add <site>-q1s<N>'\nsudo salt '<site>-q1s1' cmd.run 'pcs cluster sync'\nsudo salt '<site>-q1s<N>' cmd.run 'pcs cluster start'",
        why: "The three-step rejoin: add the node back to the cluster definition, sync the config to all nodes, then start pacemaker on the rejoined node. HTTP 400/401 on just one node is OK — proceed.",
        fixes: "Re-integrates the isolated node into the pacemaker cluster. Once done, pacemaker can manage VMs on this node again.",
        tag: "FIX",
      },
      {
        cmd: "sudo salt '<site>-q1s<N>' state.apply sites.snp.role_states.hypervisor.hydra",
        why: "Re-applies the full Hydra Salt state on the recovered node. This installs ceph-fuse (if missing), creates the systemd mount unit, and sets up everything needed for CephFS to auto-mount on reboot.",
        fixes: "Makes the fix permanent — next reboot, CephFS will mount automatically via systemd instead of staying broken.",
        tag: "FIX",
      },
    ],
  },
  {
    id: 7,
    title: "Scenario 7 – Failed OSD / Disk",
    icon: "💿",
    color: "#ff8787",
    description: "One or more OSDs are down due to a physically failed disk.",
    commands: [
      {
        cmd: "sudo ceph osd tree down",
        why: "Filtered view of only the down OSDs. Much cleaner than 'ceph osd tree' when you just want to know what's broken and which host it's on. Shows OSD number, weight, and host.",
        fixes: "Gives you the exact OSD number(s) to work with in the next steps.",
        tag: "DIAGNOSE",
      },
      {
        cmd: "sudo ceph-volume lvm list",
        why: "Maps OSD numbers to actual physical drives (e.g., OSD 5 → /dev/sdc). This is how you tell the onsite tech WHICH drive to physically pull. Also shows encrypted: 1 — reminder that you can't just swap and go.",
        fixes: "Gives the physical drive letter needed to identify the failed disk and direct onsite replacement.",
        tag: "DIAGNOSE",
      },
      {
        cmd: "sudo systemctl stop ceph-osd@<OSD_NUM>\nsudo ceph osd destroy osd.<OSD_NUM> --yes-i-really-mean-it\nsudo ceph osd purge osd.<OSD_NUM> --yes-i-really-mean-it",
        why: "Three-step OSD removal: stop the service, remove the OSD from Ceph's CRUSH map (destroy), then purge all references to it including auth keys. --yes-i-really-mean-it is required — Ceph won't do destructive ops without it.",
        fixes: "Cleanly removes the failed OSD from the cluster so Ceph stops trying to use it and begins rebalancing data to remaining OSDs.",
        tag: "FIX",
      },
      {
        cmd: "sudo ceph-volume inventory",
        why: "After inserting the replacement disk, checks if Ceph can see it and whether it's available for use. Look for available: True. If the disk had a previous OSD on it, it may show as unavailable until zapped.",
        fixes: "Confirms the new disk is visible and ready to become a new OSD.",
        tag: "VERIFY",
      },
      {
        cmd: "sudo ceph-volume lvm zap /dev/sd<X> --destroy",
        why: "Wipes all LVM metadata and partition tables from the disk. Required if the replacement disk previously had an OSD on it (or any other data). Without zapping, ceph-volume will refuse to use it.",
        fixes: "Prepares the disk for OSD creation by clearing any previous state.",
        tag: "FIX",
      },
      {
        cmd: "sudo ceph crash archive-all",
        why: "Ceph tracks crash reports and shows HEALTH_WARN until they're acknowledged. This clears them all at once. Run this after any recovery to get a clean health status.",
        fixes: "Removes stale crash reports from the health output so you can see actual current issues clearly.",
        tag: "FIX",
      },
      {
        cmd: "ansible-playbook plays/ceph/ceph_add_drives.yml -u ${USER%%@wfm.pvt} -kK --limit <site_code>",
        why: "Run from netgate. This playbook handles the entire OSD creation process: it finds available drives, formats them with LVM, encrypts them, and registers them as new OSDs in Ceph. Much safer than doing it manually.",
        fixes: "Creates new OSDs on the replacement disk(s) and adds them back to the cluster. Ceph will then rebalance data onto them automatically.",
        tag: "FIX",
      },
    ],
  },
  {
    id: 8,
    title: "Lessons Learned – NECLO Incident",
    icon: "📖",
    color: "#74c0fc",
    description: "Real incident — April 12, 2026. One reboot → 5-hour outage. Key diagnostic commands used.",
    commands: [
      {
        cmd: "corosync-cmapctl | grep member",
        why: "THE command that cracked the NECLO incident. Shows which nodes corosync actually sees as members of the cluster. This revealed a split-brain: (q1s1+q1s2) vs (q1s3+q1s4) — neither side had quorum. pacemaker quietly stopped managing VMs on BOTH sides.",
        fixes: "Exposes corosync split-brain — a silent failure mode that pacemaker doesn't explain clearly on its own.",
        tag: "DIAGNOSE",
      },
      {
        cmd: "sudo ceph mds fail <hostname>",
        why: "Forces MDS (metadata server) failover from an overloaded node to a standby. In NECLO, q1s1's MDS was crushed under rebalance I/O — virsh was timing out because every metadata op was slow. Failing it over to q1s2 instantly relieved the pressure.",
        fixes: "Relieves MDS I/O pressure without touching data. Non-destructive. The standby takes over within seconds.",
        tag: "FIX",
      },
      {
        cmd: "sudo ceph tell 'osd.*' injectargs '--osd-max-backfills 1 --osd-recovery-max-active 1'",
        why: "Throttles how aggressively Ceph rebalances data after a node comes back. Default recovery is fast but hammers I/O — which made virsh unresponsive and caused q1s4 to flap. This slows recovery down to reduce I/O pressure on the cluster.",
        fixes: "Stops MDS/virsh hangs caused by recovery I/O overload. Cluster becomes stable enough to operate while rebalancing continues slowly in the background.",
        tag: "FIX",
      },
      {
        cmd: "sudo ceph tell 'osd.*' injectargs '--osd-max-backfills 1 --osd-recovery-max-active 3'",
        why: "After the cluster has stabilized, you reset recovery throttle back toward defaults. max-active 3 is still conservative but faster than 1. Run this once virsh is responsive again and the cluster is healthy.",
        fixes: "Resumes normal recovery speed without overwhelming the cluster again.",
        tag: "FIX",
      },
      {
        cmd: "sudo iptables -L INPUT -n -v | grep <peer_IP>",
        why: "The check that would have solved NECLO in 15 minutes instead of 5 hours. The root cause was iptables rules for q1s3 missing on q1s1 and q1s2 after q1s3 rebooted. This single command reveals it instantly.",
        fixes: "Catches missing iptables ACCEPT rules for peer hypervisors — the #1 post-reboot failure cause.",
        tag: "DIAGNOSE",
      },
      {
        cmd: "sudo salt -E '(neclo)-q1s.' state.apply sites.snp.role_states.hypervisor.iptables",
        why: "The fix that ended the NECLO incident. Re-applying the iptables Salt state pushed the missing ACCEPT rules for q1s3's IP to q1s1 and q1s2. Corosync reformed, quorum restored, pacemaker started VMs.",
        fixes: "Restores missing iptables rules via Salt. This is the permanent fix — not a manual iptables command that would disappear on next reboot.",
        tag: "FIX",
      },
    ],
  },
  {
    id: 9,
    title: "Salt & Utility Commands",
    icon: "🧂",
    color: "#a9e34b",
    description: "Day-to-day Salt commands you'll use constantly.",
    commands: [
      {
        cmd: "sudo salt -E '(<site>)-q1s.' grains.get 'hydra_node'",
        why: "Checks whether each hypervisor has the hydra_node grain set to True. This grain is what tells Salt to generate Hydra-specific configs (iptables rules, SSHD peer entries, etc.). If it's missing or False, the node won't get the right rules.",
        fixes: "Diagnoses missing hydra_node grain — the root cause of nodes getting wrong/missing configurations.",
        tag: "DIAGNOSE",
      },
      {
        cmd: "sudo populate_site <sitename>",
        why: "Syncs Netbox data into Salt pillar. Run this when pillar data is stale — e.g., a node was rebuilt, IPs changed, or a new device was added. Without fresh pillar data, Salt generates configs based on outdated info.",
        fixes: "Ensures Salt has current site data from Netbox before you apply states.",
        tag: "FIX",
      },
      {
        cmd: "sudo salt <site>-q1s* saltutil.refresh_pillar\nsudo salt <site>-q1s* mine.flush\nsudo salt <site>-q1s* mine.update",
        why: "Three-step Salt refresh. refresh_pillar makes minions reload their pillar data. mine.flush clears cached peer data. mine.update re-collects current data (IPs, etc.) from each minion. Always run these before re-applying states when things seem stale.",
        fixes: "Ensures all subsequent state.apply calls use fresh, current data — not cached stale values.",
        tag: "FIX",
      },
      {
        cmd: "sudo salt -E '(<site>)-q1s1' cmd.run \"hydra cluster status | grep Online && hydra storage status | grep 'health:\\|osd:'\"",
        why: "Quick one-liner health check for the entire site. Shows which nodes are Online and Ceph storage health. Run this after any recovery to confirm everything is back to normal before closing the ticket.",
        fixes: "All-in-one verification that both the cluster and storage are healthy. Expected output: 4 nodes Online, HEALTH_OK, 12 OSDs up.",
        tag: "VERIFY",
      },
      {
        cmd: "/home/netiac/hydra/ansible/verify_deployment.sh <site_code>",
        why: "Comprehensive deployment verification script. Run this after a full node replacement or new site deployment. It checks Ceph health, VM status, pacemaker state, and more — much more thorough than manual spot checks.",
        fixes: "End-to-end validation of a site's Hydra deployment. Catch anything you may have missed.",
        tag: "VERIFY",
      },
    ],
  },
];

const tagColors = {
  DIAGNOSE: { bg: "#1e3a5f", text: "#74c0fc", border: "#1971c2" },
  FIX: { bg: "#1e3d2b", text: "#69db7c", border: "#2f9e44" },
  VERIFY: { bg: "#3d2b1e", text: "#ffa94d", border: "#e8590c" },
};

function CommandCard({ command, index }) {
  const [expanded, setExpanded] = useState(false);
  const tag = tagColors[command.tag];

  return (
    <div
      style={{
        background: expanded ? "#1a1f2e" : "#141824",
        border: `1px solid ${expanded ? "#334155" : "#1e2535"}`,
        borderRadius: "10px",
        marginBottom: "12px",
        overflow: "hidden",
        transition: "all 0.2s ease",
        cursor: "pointer",
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <div style={{ padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: "14px" }}>
        <span
          style={{
            background: tag.bg,
            color: tag.text,
            border: `1px solid ${tag.border}`,
            borderRadius: "5px",
            fontSize: "10px",
            fontWeight: "700",
            padding: "3px 8px",
            letterSpacing: "0.08em",
            fontFamily: "'JetBrains Mono', monospace",
            whiteSpace: "nowrap",
            marginTop: "2px",
            flexShrink: 0,
          }}
        >
          {command.tag}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <pre
            style={{
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontSize: "12px",
              color: "#e2e8f0",
              margin: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              lineHeight: "1.6",
            }}
          >
            {command.cmd}
          </pre>
        </div>
        <span style={{ color: "#475569", fontSize: "16px", flexShrink: 0, marginTop: "1px" }}>
          {expanded ? "▲" : "▼"}
        </span>
      </div>

      {expanded && (
        <div style={{ borderTop: "1px solid #1e2535", padding: "16px 18px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "240px" }}>
            <div style={{ fontSize: "10px", fontWeight: "700", color: "#64748b", letterSpacing: "0.1em", marginBottom: "8px" }}>
              🎯 WHY WE RUN THIS
            </div>
            <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: "1.7", margin: 0 }}>{command.why}</p>
          </div>
          <div style={{ flex: 1, minWidth: "240px" }}>
            <div style={{ fontSize: "10px", fontWeight: "700", color: "#64748b", letterSpacing: "0.1em", marginBottom: "8px" }}>
              🔧 WHAT IT FIXES
            </div>
            <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: "1.7", margin: 0 }}>{command.fixes}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [activeScenario, setActiveScenario] = useState(0);
  const scenario = scenarios[activeScenario];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#0d1117", color: "#e2e8f0" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "260px",
          minWidth: "260px",
          background: "#0a0e17",
          borderRight: "1px solid #1e2535",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: "20px 18px 14px", borderBottom: "1px solid #1e2535" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#00d4ff", letterSpacing: "0.12em", marginBottom: "4px" }}>
            CEPH / HYDRA
          </div>
          <div style={{ fontSize: "17px", fontWeight: "700", color: "#f1f5f9", lineHeight: "1.3" }}>
            Knowledge Transfer
          </div>
          <div style={{ fontSize: "11px", color: "#475569", marginTop: "4px" }}>Click commands to expand ↓</div>
        </div>

        <div style={{ padding: "10px 8px", flex: 1 }}>
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveScenario(s.id)}
              style={{
                width: "100%",
                background: activeScenario === s.id ? "#1a2236" : "transparent",
                border: activeScenario === s.id ? `1px solid ${s.color}22` : "1px solid transparent",
                borderLeft: activeScenario === s.id ? `3px solid ${s.color}` : "3px solid transparent",
                borderRadius: "7px",
                padding: "10px 12px",
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "3px",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ fontSize: "16px" }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: "12px", fontWeight: "600", color: activeScenario === s.id ? "#f1f5f9" : "#94a3b8", lineHeight: "1.3" }}>
                  {s.title}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div style={{ padding: "14px 18px", borderTop: "1px solid #1e2535" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {Object.entries(tagColors).map(([tag, c]) => (
              <span key={tag} style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}`, borderRadius: "4px", fontSize: "10px", fontWeight: "700", padding: "2px 7px", letterSpacing: "0.07em" }}>
                {tag}
              </span>
            ))}
          </div>
          <div style={{ fontSize: "10px", color: "#334155", marginTop: "6px" }}>Click any command to expand</div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "10px" }}>
            <span style={{ fontSize: "32px" }}>{scenario.icon}</span>
            <div>
              <div style={{ fontSize: "22px", fontWeight: "700", color: "#f1f5f9" }}>{scenario.title}</div>
              <div
                style={{
                  fontSize: "13px",
                  color: scenario.color,
                  fontWeight: "500",
                  marginTop: "3px",
                }}
              >
                {scenario.description}
              </div>
            </div>
          </div>

          {/* Dependency chain callout */}
          {scenario.id === 0 && (
            <div style={{ background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: "10px", padding: "16px 20px", marginTop: "16px" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#74c0fc", letterSpacing: "0.1em", marginBottom: "10px" }}>⚡ THE GOLDEN RULE — DEPENDENCY CHAIN</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#94a3b8", lineHeight: "2" }}>
                <span style={{ color: "#ff6b6b" }}>Ceph MON/MDS</span>
                <span style={{ color: "#475569" }}> → </span>
                <span style={{ color: "#ffa94d" }}>CephFS Mount</span>
                <span style={{ color: "#475569" }}> → </span>
                <span style={{ color: "#69db7c" }}>pacemaker.path</span>
                <span style={{ color: "#475569" }}> → </span>
                <span style={{ color: "#cc5de8" }}>pacemaker.service</span>
                <span style={{ color: "#475569" }}> → </span>
                <span style={{ color: "#00d4ff" }}>Hydra VMs</span>
              </div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "8px" }}>
                Break anything on the left → everything to the right goes dark.
              </div>
            </div>
          )}
        </div>

        {/* Concepts (Architecture page) */}
        {scenario.concepts && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px", marginBottom: "28px" }}>
            {scenario.concepts.map((c, i) => (
              <div key={i} style={{ background: "#141824", border: "1px solid #1e2535", borderRadius: "10px", padding: "18px 20px" }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#00d4ff", marginBottom: "10px" }}>{c.title}</div>
                <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: "1.7", margin: 0, whiteSpace: "pre-line" }}>{c.body}</p>
              </div>
            ))}
          </div>
        )}

        {/* Commands */}
        {scenario.commands && scenario.commands.length > 0 && (
          <div>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#475569", letterSpacing: "0.1em", marginBottom: "14px" }}>
              COMMANDS — {scenario.commands.length} TOTAL
            </div>
            {scenario.commands.map((cmd, i) => (
              <CommandCard key={i} command={cmd} index={i} />
            ))}
          </div>
        )}

        {/* NECLO timeline */}
        {scenario.id === 8 && (
          <div style={{ marginTop: "28px", background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: "10px", padding: "20px 24px" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#74c0fc", letterSpacing: "0.1em", marginBottom: "16px" }}>
              📍 NECLO INCIDENT TIMELINE (V2174192255) — April 12, 2026
            </div>
            {[
              "FIS rebooted neclo-q1s3 at ~2:03 PM EDT — OSDs 6/7/8 came back, Ceph began rebalancing",
              "CephFS on q1s3 hung — MDS overloaded by rebalance I/O, virsh became unresponsive",
              "VMs migrated from q1s3 → q1s4, overloading q1s4. q1s4 started flapping.",
              "pacemaker.path failed — /mnt/cephfs/virtualmachines/ not accessible",
              "ROOT CAUSE: iptables rules for q1s3 (10.58.30.63) MISSING on q1s1 and q1s2 → corosync split-brain",
              "Split: (q1s1+q1s2) vs (q1s3+q1s4) — neither side had 3/4 votes → pacemaker stopped on BOTH sides",
              "Fix: Added missing iptables rules → corosync reformed → 4 nodes, quorum → pacemaker started VMs",
              "Applied Salt state to persist rules. Total outage: ~5 hours. With this SOP: ~15 minutes.",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "14px", marginBottom: "10px", alignItems: "flex-start" }}>
                <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: i === 4 ? "#ff6b6b22" : "#1e2535", border: `1px solid ${i === 4 ? "#ff6b6b" : "#334155"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "700", color: i === 4 ? "#ff6b6b" : "#64748b", flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ fontSize: "13px", color: i === 4 ? "#fca5a5" : "#94a3b8", lineHeight: "1.6", paddingTop: "2px" }}>{step}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
