import React, { useEffect, useState } from 'react';
import { getCases, createCase } from '../api';

const Cases = () => {
  const [cases, setCases] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    incidentDate: '',
    analyst: '',
  });

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const res = await getCases();
      setCases(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.analyst) {
      alert('Title and Analyst are required');
      return;
    }
    setLoading(true);
    try {
      await createCase(form);
      setForm({ title: '', description: '', location: '', incidentDate: '', analyst: '' });
      setShowForm(false);
      fetchCases();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const statusColor = (status) => {
    if (status === 'ACTIVE') return { color: '#00d4aa' };
    if (status === 'REVIEW') return { color: '#e8a020' };
    return { color: '#6a8099' };
  };

  return (
    <div style={styles.main}>
      <div style={styles.topbar}>
        <div>
          <div style={styles.pageTitle}>CASE MANAGEMENT</div>
          <div style={styles.pageSub}>All Investigation Cases</div>
        </div>
        <button style={styles.btn} onClick={() => setShowForm(!showForm)}>
          + New Case
        </button>
      </div>

      {showForm && (
        <div style={styles.form}>
          <div style={styles.formTitle}>CREATE NEW CASE</div>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Case Title *</label>
              <input
                style={styles.input}
                placeholder="e.g. Koramangala Robbery"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Analyst Name *</label>
              <input
                style={styles.input}
                placeholder="e.g. A.Sharma"
                value={form.analyst}
                onChange={e => setForm({ ...form, analyst: e.target.value })}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Location</label>
              <input
                style={styles.input}
                placeholder="e.g. Koramangala, Bangalore"
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Incident Date</label>
              <input
                style={styles.input}
                type="date"
                value={form.incidentDate}
                onChange={e => setForm({ ...form, incidentDate: e.target.value })}
              />
            </div>
            <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
              <label style={styles.label}>Description</label>
              <textarea
                style={{ ...styles.input, height: '80px', resize: 'none' }}
                placeholder="Brief description of the case..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button style={styles.btn} onClick={handleSubmit} disabled={loading}>
              {loading ? 'Creating...' : 'Create Case'}
            </button>
            <button style={styles.btnGhost} onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <div style={styles.th}>CASE ID</div>
          <div style={styles.th}>TITLE</div>
          <div style={styles.th}>LOCATION</div>
          <div style={styles.th}>ANALYST</div>
          <div style={styles.th}>DATE</div>
          <div style={styles.th}>STATUS</div>
        </div>
        {cases.length === 0 && (
          <div style={styles.empty}>No cases yet. Create one above.</div>
        )}
        {cases.map((c) => (
          <div key={c._id} style={styles.tableRow}>
            <div style={{ ...styles.td, color: '#00d4aa' }}>{c.caseId}</div>
            <div style={styles.td}>{c.title}</div>
            <div style={styles.td}>{c.location || '—'}</div>
            <div style={styles.td}>{c.analyst || '—'}</div>
            <div style={styles.td}>
              {c.incidentDate ? new Date(c.incidentDate).toLocaleDateString() : '—'}
            </div>
            <div style={{ ...styles.td, ...statusColor(c.status) }}>{c.status}</div>
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
  btn: { padding: '8px 18px', background: '#0f2d1e', color: '#00d4aa', border: '0.5px solid #00d4aa40', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontFamily: 'monospace', letterSpacing: '0.5px' },
  btnGhost: { padding: '8px 18px', background: 'transparent', color: '#6a8099', border: '0.5px solid #2a3a4a', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontFamily: 'monospace' },
  form: { background: '#0d1117', border: '0.5px solid #1e2d40', borderRadius: '8px', padding: '24px', marginBottom: '24px' },
  formTitle: { fontSize: '12px', color: '#4a6080', letterSpacing: '1px', marginBottom: '20px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '11px', color: '#4a6080', letterSpacing: '1px' },
  input: { background: '#050810', border: '0.5px solid #1e2d40', borderRadius: '6px', padding: '10px 12px', color: '#e0e6f0', fontSize: '13px', fontFamily: 'monospace', outline: 'none' },
  table: { background: '#0d1117', border: '0.5px solid #1e2d40', borderRadius: '8px', overflow: 'hidden' },
  tableHeader: { display: 'grid', gridTemplateColumns: '120px 1fr 1fr 120px 120px 100px', padding: '12px 20px', borderBottom: '0.5px solid #1e2d40', background: '#050810' },
  th: { fontSize: '11px', color: '#4a6080', letterSpacing: '1px' },
  tableRow: { display: 'grid', gridTemplateColumns: '120px 1fr 1fr 120px 120px 100px', padding: '14px 20px', borderBottom: '0.5px solid #1a2030' },
  td: { fontSize: '13px', color: '#c0cce0' },
  empty: { padding: '40px', textAlign: 'center', color: '#4a6080', fontSize: '13px' },
};

export default Cases;