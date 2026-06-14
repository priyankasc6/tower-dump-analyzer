import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { getCases, correlate } from '../api';

// Fix default marker icon issue with Leaflet + React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const colors = ['#00d4aa', '#e8a020', '#e24b4a', '#8060d0', '#378ade', '#f0997b'];

const RouteMap = () => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedSuspect, setSelectedSuspect] = useState(null);

  useEffect(() => {
    getCases().then(res => setCases(res.data));
  }, []);

  const handleLoad = async () => {
    if (!selectedCase) return;
    setLoading(true);
    setError('');
    setResults(null);
    setSelectedSuspect(null);
    try {
      const res = await correlate(selectedCase);
      setResults(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    }
    setLoading(false);
  };

  // Default map center (Bangalore)
  const defaultCenter = [12.9716, 77.5946];

  // Get all valid points for current view
  const getMapData = () => {
    if (!results) return { points: [], lines: [] };

    const suspects = selectedSuspect !== null
      ? [results.suspects[selectedSuspect]]
      : results.suspects;

    const points = [];
    const lines = [];

    suspects.forEach((s, idx) => {
      const color = colors[idx % colors.length];
      const validPoints = s.appearances.filter(a => a.lat && a.lng && a.lat !== 0);
      validPoints.forEach(a => {
        points.push({ ...a, msisdn: s.msisdn, color });
      });
      if (validPoints.length > 1) {
        lines.push({
          positions: validPoints.map(a => [a.lat, a.lng]),
          color,
          msisdn: s.msisdn
        });
      }
    });

    return { points, lines };
  };

  const { points, lines } = getMapData();
  const center = points.length > 0 ? [points[0].lat, points[0].lng] : defaultCenter;

  return (
    <div style={styles.main}>
      <div style={styles.topbar}>
        <div>
          <div style={styles.pageTitle}>ROUTE MAP</div>
          <div style={styles.pageSub}>Suspect Movement Visualization</div>
        </div>
      </div>

      <div style={styles.panel}>
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
          <button style={styles.btn} onClick={handleLoad} disabled={loading}>
            {loading ? 'Loading...' : 'Load Movement Data'}
          </button>
        </div>
        {error && <div style={styles.error}>{error}</div>}
      </div>

      {results && (
        <div style={styles.grid}>
          <div style={styles.sidebar}>
            <div style={styles.panelTitle}>SUSPECTS ({results.commonCount})</div>
            <div
              style={{ ...styles.suspectItem, ...(selectedSuspect === null ? styles.suspectActive : {}) }}
              onClick={() => setSelectedSuspect(null)}
            >
              Show All
            </div>
            {results.suspects.map((s, i) => (
              <div
                key={i}
                style={{ ...styles.suspectItem, ...(selectedSuspect === i ? styles.suspectActive : {}) }}
                onClick={() => setSelectedSuspect(i)}
              >
                <span style={{ ...styles.colorDot, background: colors[i % colors.length] }}></span>
                {s.msisdn}
                <span style={styles.suspectCount}>{s.totalLocations} locations</span>
              </div>
            ))}
          </div>

          <div style={styles.mapContainer}>
            {points.length === 0 ? (
              <div style={styles.noData}>
                No location coordinates found. Make sure tower latitude/longitude were entered during upload.
              </div>
            ) : (
              <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                {points.map((p, i) => (
                  <Marker key={i} position={[p.lat, p.lng]}>
                    <Popup>
                      <b>{p.msisdn}</b><br />
                      Location: {p.location}<br />
                      Time: {p.timestamp ? new Date(p.timestamp).toLocaleString() : 'Unknown'}
                    </Popup>
                  </Marker>
                ))}
                {lines.map((line, i) => (
                  <Polyline key={i} positions={line.positions} color={line.color} weight={3} opacity={0.7} />
                ))}
              </MapContainer>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  main: { marginLeft: '220px', padding: '28px 32px' },
  topbar: { marginBottom: '20px' },
  pageTitle: { fontSize: '18px', fontWeight: '500', color: '#e0e6f0', letterSpacing: '1px' },
  pageSub: { fontSize: '12px', color: '#4a6080', marginTop: '4px' },
  panel: { background: '#0d1117', border: '0.5px solid #1e2d40', borderRadius: '8px', padding: '20px', marginBottom: '20px' },
  panelTitle: { fontSize: '12px', color: '#4a6080', letterSpacing: '1px', marginBottom: '16px' },
  input: { background: '#050810', border: '0.5px solid #1e2d40', borderRadius: '6px', padding: '10px 12px', color: '#e0e6f0', fontSize: '13px', fontFamily: 'monospace', outline: 'none' },
  btn: { padding: '10px 20px', background: '#0f2d1e', color: '#00d4aa', border: '0.5px solid #00d4aa40', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontFamily: 'monospace', whiteSpace: 'nowrap' },
  error: { fontSize: '12px', color: '#e24b4a', marginTop: '12px', fontFamily: 'monospace' },
  grid: { display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px', height: '550px' },
  sidebar: { background: '#0d1117', border: '0.5px solid #1e2d40', borderRadius: '8px', padding: '16px', overflowY: 'auto' },
  suspectItem: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '6px', fontSize: '12px', color: '#c0cce0', cursor: 'pointer', marginBottom: '4px', fontFamily: 'monospace' },
  suspectActive: { background: '#0f2d1e', color: '#00d4aa' },
  colorDot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 },
  suspectCount: { marginLeft: 'auto', fontSize: '10px', color: '#4a6080' },
  mapContainer: { background: '#0d1117', border: '0.5px solid #1e2d40', borderRadius: '8px', overflow: 'hidden' },
  noData: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#4a6080', fontSize: '13px', padding: '40px', textAlign: 'center' },
};

export default RouteMap;