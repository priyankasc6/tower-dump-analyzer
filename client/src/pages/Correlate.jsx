import React, { useState, useEffect } from 'react';
import { getCases, correlate } from '../api';

const Correlate = () => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getCases().then(res => setCases(res.data));
  }, []);

  const handleCorrelate = async () => {
    if (!selectedCase) return;
    setLoading(true);
    setError('');
    setResults(null);
    try {
      const res = await correlate(selectedCase);
      setResults(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Correlation failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.main}>
      <div style={styles.topbar}>
        <div>
          <div style={styles.pageTitle}>CORRELATION ENGINE</div>
          <div style={styles.pageSub}>Find Common Numbers Across Tower Dumps</div>
        </div>
      </div>

      <div style={styles.panel}>
        <div style={styles.panelTitle}>SELECT CASE TO CORRELATE</div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select
            style={{ ...styles.input, flex: 1 }}
            value={selectedCase}
            onChange={e => setSelectedCase(e.target.value)}
          >
            <option value="">-- Select a Case --</option>
            {cases.map(c => (
              <option key={c.caseId} value={c.caseId}>{c.caseId} — {c.title}</option>
            ))}
          </select>
          <button style={styles.btn} onClick={handleCorrelate} disabled={loading}>
            {loading ? 'Running...' : 'Run Correlation'}
          </button>
        </div>
        {error && <div style={styles.error}>{error}</div>}
      </div>

      {results && (
        <>
          <div style={styles.statsRow}>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>DUMPS ANALYZED</div>
              <div style={styles.statValue}>{results.totalDumps}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>COMMON NUMBERS</div>
              <div style={{ ...styles.statValue, color: '#e8a020' }}>{results.commonCount}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>CASE ID</div>
              <div style={{ ...styles.statValue, color: '#00d4aa' }}>{results.caseId}</div>
            </div>
          </div>

          <div style={styles.panel}>
            <div style={styles.panelTitle}>PERSONS OF INTEREST — {results.commonCount} IDENTIFIED</div>
            {results.suspects.map((s, i) => (
              <div key={i} style={styles.suspectCard}>
                <div style={styles.suspectHeader}>
                  <div style={styles.suspectNumber}>{s.msisdn}</div>
                  <div style={styles.suspectBadge}>APPEARED AT {s.totalLocations} LOCATIONS</div>
                </div>
                <div style={styles.timeline}>
                  {s.appearances.map((a, j) => (
                    <div key={j} style={styles.timelineItem}>
                      <div style={styles.timelineDot}></div>
                      <div>
                        <div style={styles.timelineLocation}>{a.location}</div>
                        <div style={styles.timelineTime}>
                          {a.timestamp ? new Date(a.timestamp).toLocaleString() : 'Unknown time'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  main: { marginLeft: '220px', padding: '28px 32px' },
  topbar: { marginBottom: '28px' },
  pageTitle: { fontSize: '18px', fontWeight: '500', color: '#e0e6f0', letterSpacing: '1px' },
  pageSub: { fontSize: '12px', color: '#4a6080', marginTop: '4px' },
  panel: { background: '#0d1117', border: '0.5px solid #1e2d40', borderRadius: '8px', padding: '24px', marginBottom: '20px' },
  panelTitle: { fontSize: '12px', color: '#4a6080', letterSpacing: '1px', marginBottom: '16px' },
  input: { background: '#050810', border: '0.5px solid #1e2d40', borderRadius: '6px', padding: '10px 12px', color: '#e0e6f0', fontSize: '13px', fontFamily: 'monospace', outline: 'none' },
  btn: { padding: '10px 20px', background: '#0f2d1e', color: '#00d4aa', border: '0.5px solid #00d4aa40', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontFamily: 'monospace', whiteSpace: 'nowrap' },
  error: { fontSize: '12px', color: '#e24b4a', marginTop: '12px', fontFamily: 'monospace' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' },
  statCard: { background: '#0d1117', border: '0.5px solid #1e2d40', borderRadius: '8px', padding: '18px 20px' },
  statLabel: { fontSize: '11px', color: '#4a6080', letterSpacing: '1px', marginBottom: '8px' },
  statValue: { fontSize: '24px', fontWeight: '500', color: '#e0e6f0' },
  suspectCard: { background: '#050810', border: '0.5px solid #1e2d40', borderRadius: '6px', padding: '16px', marginBottom: '12px' },
  suspectHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' },
  suspectNumber: { fontSize: '14px', color: '#00d4aa', fontFamily: 'monospace' },
  suspectBadge: { fontSize: '10px', padding: '3px 8px', background: '#2d1f0a', color: '#e8a020', border: '0.5px solid #e8a02030', borderRadius: '3px' },
  timeline: { display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '12px', borderLeft: '1px solid #1e2d40' },
  timelineItem: { display: 'flex', gap: '10px', alignItems: 'flex-start' },
  timelineDot: { width: '6px', height: '6px', borderRadius: '50%', background: '#00d4aa', marginTop: '4px', flexShrink: 0 },
  timelineLocation: { fontSize: '12px', color: '#c0cce0' },
  timelineTime: { fontSize: '11px', color: '#4a6080', marginTop: '2px' },
};

export default Correlate;