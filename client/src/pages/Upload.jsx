import React, { useState, useEffect } from 'react';
import { getCases, uploadEvidence, getEvidence } from '../api';

const Upload = () => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState('');
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ towerLocation: '', towerLat: '', towerLng: '', uploadedBy: '' });
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getCases().then(res => setCases(res.data));
  }, []);

  useEffect(() => {
    if (selectedCase) {
      getEvidence(selectedCase).then(res => setEvidence(res.data));
    }
  }, [selectedCase]);

  const handleUpload = async () => {
    if (!selectedCase || !file || !form.towerLocation || !form.uploadedBy) {
      setMessage('Please fill all required fields and select a file');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('caseId', selectedCase);
      formData.append('towerLocation', form.towerLocation);
      formData.append('towerLat', form.towerLat || '0');
      formData.append('towerLng', form.towerLng || '0');
      formData.append('uploadedBy', form.uploadedBy);
      const res = await uploadEvidence(formData);
      setMessage(`Success — ${res.data.totalRecords} records parsed and stored`);
      getEvidence(selectedCase).then(r => setEvidence(r.data));
      setFile(null);
    } catch (err) {
      setMessage('Upload failed — check console');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={styles.main}>
      <div style={styles.topbar}>
        <div>
          <div style={styles.pageTitle}>UPLOAD EVIDENCE</div>
          <div style={styles.pageSub}>Ingest Tower Dump Files</div>
        </div>
      </div>

      <div style={styles.grid2}>
        <div style={styles.panel}>
          <div style={styles.panelTitle}>EVIDENCE FILE UPLOAD</div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Select Case *</label>
            <select
              style={styles.input}
              value={selectedCase}
              onChange={e => setSelectedCase(e.target.value)}
            >
              <option value="">-- Select a Case --</option>
              {cases.map(c => (
                <option key={c.caseId} value={c.caseId}>{c.caseId} — {c.title}</option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Tower Location Name *</label>
            <input
              style={styles.input}
              placeholder="e.g. Koramangala Tower 3"
              value={form.towerLocation}
              onChange={e => setForm({ ...form, towerLocation: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Latitude</label>
              <input
                style={styles.input}
                placeholder="e.g. 12.9352"
                value={form.towerLat}
                onChange={e => setForm({ ...form, towerLat: e.target.value })}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Longitude</label>
              <input
                style={styles.input}
                placeholder="e.g. 77.6245"
                value={form.towerLng}
                onChange={e => setForm({ ...form, towerLng: e.target.value })}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Analyst Name *</label>
            <input
              style={styles.input}
              placeholder="e.g. A.Sharma"
              value={form.uploadedBy}
              onChange={e => setForm({ ...form, uploadedBy: e.target.value })}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Tower Dump File (Excel) *</label>
            <div style={styles.fileBox}>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={e => setFile(e.target.files[0])}
                style={{ color: '#e0e6f0', fontSize: '13px' }}
              />
            </div>
            {file && <div style={styles.fileName}>Selected: {file.name}</div>}
          </div>

          <button style={styles.btn} onClick={handleUpload} disabled={loading}>
            {loading ? 'Uploading & Parsing...' : 'Upload Evidence'}
          </button>

          {message && (
            <div style={{
              ...styles.message,
              color: message.startsWith('Success') ? '#00d4aa' : '#e24b4a'
            }}>
              {message}
            </div>
          )}
        </div>

        <div style={styles.panel}>
          <div style={styles.panelTitle}>UPLOADED EVIDENCE FOR CASE</div>
          {evidence.length === 0 && (
            <div style={styles.empty}>No evidence uploaded yet for this case</div>
          )}
          {evidence.map((e, i) => (
            <div key={i} style={styles.evidenceCard}>
              <div style={styles.evidenceFile}>{e.fileName}</div>
              <div style={styles.evidenceMeta}>Tower: {e.towerLocation}</div>
              <div style={styles.evidenceMeta}>Records: {e.totalRecords}</div>
              <div style={styles.evidenceMeta}>
                Uploaded: {new Date(e.uploadedAt).toLocaleString()}
              </div>
              <div style={styles.evidenceMeta}>By: {e.uploadedBy}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  main: { marginLeft: '220px', padding: '28px 32px' },
  topbar: { marginBottom: '28px' },
  pageTitle: { fontSize: '18px', fontWeight: '500', color: '#e0e6f0', letterSpacing: '1px' },
  pageSub: { fontSize: '12px', color: '#4a6080', marginTop: '4px' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  panel: { background: '#0d1117', border: '0.5px solid #1e2d40', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' },
  panelTitle: { fontSize: '12px', color: '#4a6080', letterSpacing: '1px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '11px', color: '#4a6080', letterSpacing: '1px' },
  input: { background: '#050810', border: '0.5px solid #1e2d40', borderRadius: '6px', padding: '10px 12px', color: '#e0e6f0', fontSize: '13px', fontFamily: 'monospace', outline: 'none' },
  fileBox: { background: '#050810', border: '0.5px solid #1e2d40', borderRadius: '6px', padding: '12px' },
  fileName: { fontSize: '11px', color: '#00d4aa', marginTop: '4px' },
  btn: { padding: '10px 20px', background: '#0f2d1e', color: '#00d4aa', border: '0.5px solid #00d4aa40', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontFamily: 'monospace', letterSpacing: '0.5px' },
  message: { fontSize: '12px', padding: '10px', background: '#050810', borderRadius: '6px', fontFamily: 'monospace' },
  evidenceCard: { background: '#050810', border: '0.5px solid #1e2d40', borderRadius: '6px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '4px' },
  evidenceFile: { fontSize: '13px', color: '#00d4aa', marginBottom: '4px' },
  evidenceMeta: { fontSize: '11px', color: '#6a8099' },
  empty: { fontSize: '13px', color: '#4a6080', padding: '20px 0' },
};

export default Upload;