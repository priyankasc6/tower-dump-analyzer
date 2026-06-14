import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getCases, correlate, getCaseAudit } from '../api';

const Reports = () => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState('');
  const [results, setResults] = useState(null);
  const [caseDetails, setCaseDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getCases().then(res => setCases(res.data));
  }, []);

  const handleGenerate = async () => {
    if (!selectedCase) return;
    setLoading(true);
    setError('');
    setResults(null);
    try {
      const caseRes = await getCases();
      const c = caseRes.data.find(c => c.caseId === selectedCase);
      setCaseDetails(c);

      const corrRes = await correlate(selectedCase);
      setResults(corrRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate report data');
    }
    setLoading(false);
  };

  const downloadPDF = async () => {
    if (!results || !caseDetails) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(13, 17, 23);
    doc.rect(0, 0, pageWidth, 30, 'F');
    doc.setTextColor(0, 212, 170);
    doc.setFontSize(20);
    doc.setFont('courier', 'bold');
    doc.text('CIPHERTRACE', 14, 15);
    doc.setFontSize(9);
    doc.setTextColor(180, 200, 220);
    doc.text('DFIR FORENSIC ANALYSIS REPORT', 14, 22);

    // Case Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Case Information', 14, 42);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    let y = 50;
    const info = [
      ['Case ID', caseDetails.caseId],
      ['Title', caseDetails.title],
      ['Location', caseDetails.location || 'N/A'],
      ['Analyst', caseDetails.analyst || 'N/A'],
      ['Status', caseDetails.status],
      ['Incident Date', caseDetails.incidentDate ? new Date(caseDetails.incidentDate).toLocaleDateString() : 'N/A'],
      ['Report Generated', new Date().toLocaleString()],
    ];
    info.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${label}:`, 14, y);
      doc.setFont('helvetica', 'normal');
      doc.text(String(value), 60, y);
      y += 7;
    });

    // Summary
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Correlation Summary', 14, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total tower dumps analyzed: ${results.totalDumps}`, 14, y);
    y += 6;
    doc.text(`Common numbers identified (persons of interest): ${results.commonCount}`, 14, y);
    y += 12;

    // Suspects Table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Persons of Interest — Movement Timeline', 14, y);
    y += 6;

    const tableRows = [];
    results.suspects.forEach(s => {
      s.appearances.forEach((a, idx) => {
        tableRows.push([
          idx === 0 ? s.msisdn : '',
          a.location,
          a.timestamp ? new Date(a.timestamp).toLocaleString() : 'Unknown'
        ]);
      });
    });

    autoTable(doc, {
      startY: y + 4,
      head: [['MSISDN', 'Tower Location', 'Timestamp']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [13, 17, 23], textColor: [0, 212, 170] },
      styles: { fontSize: 9 },
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `CipherTrace DFIR Report — Case ${caseDetails.caseId} — Page ${i} of ${pageCount}`,
        14,
        doc.internal.pageSize.getHeight() - 10
      );
    }

    doc.save(`CipherTrace_Report_${caseDetails.caseId}.pdf`);
  };

  return (
    <div style={styles.main}>
      <div style={styles.topbar}>
        <div>
          <div style={styles.pageTitle}>FORENSIC REPORT</div>
          <div style={styles.pageSub}>Generate Case Investigation Report</div>
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
          <button style={styles.btn} onClick={handleGenerate} disabled={loading}>
            {loading ? 'Loading...' : 'Generate Report Preview'}
          </button>
        </div>
        {error && <div style={styles.error}>{error}</div>}
      </div>

      {results && caseDetails && (
        <div style={styles.panel}>
          <div style={styles.panelTitle}>REPORT PREVIEW</div>

          <div style={styles.previewSection}>
            <div style={styles.previewTitle}>Case Information</div>
            <div style={styles.previewRow}><span>Case ID</span><span>{caseDetails.caseId}</span></div>
            <div style={styles.previewRow}><span>Title</span><span>{caseDetails.title}</span></div>
            <div style={styles.previewRow}><span>Location</span><span>{caseDetails.location || 'N/A'}</span></div>
            <div style={styles.previewRow}><span>Analyst</span><span>{caseDetails.analyst || 'N/A'}</span></div>
            <div style={styles.previewRow}><span>Status</span><span>{caseDetails.status}</span></div>
          </div>

          <div style={styles.previewSection}>
            <div style={styles.previewTitle}>Correlation Summary</div>
            <div style={styles.previewRow}><span>Dumps Analyzed</span><span>{results.totalDumps}</span></div>
            <div style={styles.previewRow}><span>Common Numbers Found</span><span style={{ color: '#00d4aa' }}>{results.commonCount}</span></div>
          </div>

          <div style={styles.previewSection}>
            <div style={styles.previewTitle}>Persons of Interest</div>
            {results.suspects.map((s, i) => (
              <div key={i} style={styles.suspectPreview}>
                <div style={styles.suspectNum}>{s.msisdn}</div>
                {s.appearances.map((a, j) => (
                  <div key={j} style={styles.previewRow}>
                    <span>{a.location}</span>
                    <span>{a.timestamp ? new Date(a.timestamp).toLocaleString() : 'Unknown'}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <button style={styles.btnDownload} onClick={downloadPDF}>
            Download PDF Report
          </button>
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
  btnDownload: { padding: '12px 24px', background: '#00d4aa', color: '#050810', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontFamily: 'monospace', fontWeight: 'bold', marginTop: '12px' },
  error: { fontSize: '12px', color: '#e24b4a', marginTop: '12px', fontFamily: 'monospace' },
  previewSection: { marginBottom: '20px', paddingBottom: '16px', borderBottom: '0.5px solid #1a2030' },
  previewTitle: { fontSize: '13px', color: '#00d4aa', marginBottom: '10px', fontWeight: 'bold' },
  previewRow: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#c0cce0', padding: '4px 0' },
  suspectPreview: { background: '#050810', border: '0.5px solid #1e2d40', borderRadius: '6px', padding: '12px', marginBottom: '8px' },
  suspectNum: { fontSize: '13px', color: '#e8a020', marginBottom: '6px', fontFamily: 'monospace' },
};

export default Reports;