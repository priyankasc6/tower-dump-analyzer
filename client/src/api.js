import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const getCases = () => API.get('/cases');
export const createCase = (data) => API.post('/cases', data);
export const updateCase = (caseId, data) => API.patch(`/cases/${caseId}`, data);
export const getEvidence = (caseId) => API.get(`/evidence/${caseId}`);
export const uploadEvidence = (formData) => API.post('/evidence/upload', formData);
export const correlate = (caseId) => API.get(`/correlate/${caseId}`);
export const getAuditLogs = () => API.get('/audit');
export const getCaseAudit = (caseId) => API.get(`/audit/${caseId}`);