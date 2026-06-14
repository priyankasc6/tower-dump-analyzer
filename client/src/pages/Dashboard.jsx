import React from 'react';

const stats = [
  { label: 'TOTAL CASES', value: '24', color: '#e0e6f0', change: '↑ 3 this week' },
  { label: 'ACTIVE INVESTIGATIONS', value: '7', color: '#e8a020', change: '2 high priority' },
  { label: 'SUSPECTS IDENTIFIED', value: '142', color: '#00d4aa', change: '↑ 18 from last dump' },
  { label: 'EVIDENCE FILES', value: '89', color: '#e24b4a', change: '12 pending review' },
];

const cases = [
  { id: '#CT-0021', name: 'Koramangala Robbery', status: 'ACTIVE' },
  { id: '#CT-0019', name: 'MG Road Incident', status: 'REVIEW' },
  { id: '#CT-0017', name: 'Whitefield Fraud', status: 'ACTIVE' },
  { id: '#CT-0014', name: 'Jayanagar Case', status: 'CLOSED' },
  { id: '#CT-0011', name: 'Indiranagar Theft', status: 'CLOSED' },
];

const activity = [
  { type: 'upload', text: 'Tower dump uploaded — Koramangala Tower 3', time: 'Today, 14:32 · Analyst: A.Sharma' },
  { type: 'alert', text: 'Anomaly flagged — MSISDN appeared at 4 towers', time: 'Today, 13:10 · Auto-detection' },
  { type: 'report', text: 'Forensic report generated for case #CT-0019', time: 'Yesterday, 18:45 · Analyst: R.Menon' },
  { type: 'upload', text: '3 evidence files ingested — MG Road dump set', time: 'Yesterday, 11:20 · Analyst: A.Sharma' },
];

const logs = [
  { time: '14:32:01', color: '#00d4aa', text: 'Evidence ingested: tower_dump_koramangala_3.xlsx → 1,247 records parsed' },
  { time: '14:30:44', color: '#00d4aa', text: 'Correlation engine: 18 common MSISDNs identified across 3 locations' },
  { time: '13:10:22', color: '#e8a020', text: 'ANOMALY DETECTED: MSISDN frequency spike at Tower T-07, T-12, T-15' },
  { time: '12:58:03', color: '#00d4aa', text: 'Case #CT-0021 updated — route map reconstructed, 6 waypoints' },
  { time: '09:00:00', color: '#3a5060', text: 'System initialized — CipherTrace DFIR v1.0.0 online ●' },
];

const statusStyle = (status) => {
  if (status === 'ACTIVE') return { background: '#0f2d1e', color: '#00d4aa', border: '0.5px solid #00d4aa30' };
  if (status === 'REVIEW') return { background: '#2d1f0a', color: '#e8a020', border: '0.5px solid #e8a02030' };
  return { background: '#1a1a2e', color: '#6a8099', border: '0.5px solid #6a809930' };
};

const Dashboard = () => {
  return (
    <div style={styles.main}>
      <div style={styles.topbar}>
        <div>
          <div style={styles.pageTitle}>FORENSIC DASHBOARD</div>
          <div style={styles.pageSub}>Tower Dump Analysis — Active Session</div>
        </div>
        <div style={styles.badge}>● SYSTEM ONLINE</div>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        {stats.map((s) => (
          <div key={s.label} style={styles.statCard}>
            <div style={styles.statLabel}>{s.label}</div>
            <div style={{ ...styles.statValue, color: s.color }}>{s.value}</div>
            <div style={styles.statChange}>{s.change}</div>
          </div>
        ))}
      </div>

      {/* Workflow */}
      <div style={styles.workflow}>
        {['Create Case', 'Upload Dump', 'Correlate', 'Track Movement', 'Visualize Route', 'PDF Report'].map((step, i) => (
          <React.Fragment key={step}>
            <div style={{ ...styles.wfStep, ...(i < 2 ? styles.wfDone : i === 2 ? styles.wfActive : {}) }}>
              {step}
            </div>
            {i < 5 && <div style={styles.wfArrow}>›</div>}
          </React.Fragment>
        ))}
      </div>

      {/* Panels */}
      <div style={styles.grid2}>
        <div style={styles.panel}>
          <div style={styles.panelTitle}>◈ RECENT CASES</div>
          {cases.map((c) => (
            <div key={c.id} style={styles.caseRow}>
              <div style={styles.caseId}>{c.id}</div>
              <div style={styles.caseName}>{c.name}</div>
              <div style={{ ...styles.caseStatus, ...statusStyle(c.status) }}>{c.status}</div>
            </div>
          ))}
        </div>

        <div style={styles.panel}>
          <div style={styles.panelTitle}>⊕ RECENT ACTIVITY</div>
          {activity.map((a, i) => (
            <div key={i} style={styles.actRow}>
              <div style={styles.actText}>{a.text}</div>
              <div style={styles.actTime}>{a.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal */}
      <div style={styles.terminal}>
        <div style={{ color: '#3a5060', marginBottom: '8px' }}>// CIPHERTRACE SYSTEM LOG ──────────────────────</div>
        {logs.map((log, i) => (
          <div key={i}>
            <span style={{ color: log.color }}>[{log.time}]</span>{' '}
            <span style={{ color: '#8aa0b0' }}>{log.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  main: { marginLeft: '220px', padding: '28px 32px' },
  topbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' },
  pageTitle: { fontSize: '18px', fontWeight: '500', color: '#e0e6f0', letterSpacing: '1px' },
  pageSub: { fontSize: '12px', color: '#4a6080', marginTop: '4px' },
  badge: { fontSize: '11px', padding: '4px 10px', borderRadius: '4px', background: '#0f2d1e', color: '#00d4aa', border: '0.5px solid #00d4aa40', letterSpacing: '1px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' },
  statCard: { background: '#0d1117', border: '0.5px solid #1e2d40', borderRadius: '8px', padding: '18px 20px' },
  statLabel: { fontSize: '11px', color: '#4a6080', letterSpacing: '1px', marginBottom: '10px' },
  statValue: { fontSize: '26px', fontWeight: '500' },
  statChange: { fontSize: '11px', color: '#4a6080', marginTop: '6px' },
  workflow: { display: 'flex', alignItems: 'center', marginBottom: '20px' },
  wfStep: { flex: 1, textAlign: 'center', padding: '12px 8px', background: '#0d1117', border: '0.5px solid #1e2d40', fontSize: '11px', color: '#4a6080', letterSpacing: '0.5px' },
  wfDone: { color: '#00d4aa', borderColor: '#00d4aa30', background: '#0a1f18' },
  wfActive: { color: '#e8a020', borderColor: '#e8a02040', background: '#1a1200' },
  wfArrow: { color: '#2a3a4a', fontSize: '16px', flexShrink: 0 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' },
  panel: { background: '#0d1117', border: '0.5px solid #1e2d40', borderRadius: '8px', padding: '20px' },
  panelTitle: { fontSize: '12px', color: '#4a6080', letterSpacing: '1px', marginBottom: '16px' },
  caseRow: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '0.5px solid #1a2030' },
  caseId: { fontSize: '11px', color: '#00d4aa', minWidth: '80px' },
  caseName: { fontSize: '13px', color: '#c0cce0', flex: 1 },
  caseStatus: { fontSize: '10px', padding: '3px 8px', borderRadius: '3px', letterSpacing: '0.5px' },
  actRow: { padding: '10px 0', borderBottom: '0.5px solid #1a2030' },
  actText: { fontSize: '12px', color: '#c0cce0', lineHeight: '1.5' },
  actTime: { fontSize: '10px', color: '#4a6080', marginTop: '4px' },
  terminal: { background: '#050810', border: '0.5px solid #1e2d40', borderRadius: '6px', padding: '16px', fontSize: '11px', fontFamily: 'monospace', lineHeight: '1.8' },
};

export default Dashboard;