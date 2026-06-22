// ============================================================================
// Core layer — static constants: palette, type metadata, month names, demo seed.
// ============================================================================
export const PALETTE = {
  blue: '#2f54eb', green: '#0f9d6b', amber: '#e8a90c', red: '#e23d5a',
  violet: '#6c47d6', cyan: '#0bb5c9', pink: '#e84393', orange: '#f06a1e',
};

export const SWATCH_SETS = {
  release: ['blue', 'green', 'amber', 'red', 'violet', 'cyan', 'pink', 'orange'].map((k) => PALETTE[k]),
  sprint: ['blue', 'green', 'amber', 'violet', 'cyan', 'orange'].map((k) => PALETTE[k]),
};

export const TYPE = {
  release: { label: 'Release', def: PALETTE.blue },
  sprint: { label: 'Sprint', def: PALETTE.violet },
  leave: { label: 'Leave', def: PALETTE.red },
};

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
export const MON_S = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Month-grid layout constants (used by the calendar view).
export const MAX_LANES = 4;
export const BAR_TOP = 30;
export const LANE = 24;

// Sample data seeded into the demo (localStorage) store on first run.
export const DEMO = [
  { type: 'release', color: '#2f54eb', functionalityName: 'Audience Segmentation', version: 'v5.2.0', releaseDate: '2026-05-08', module: 'Audience', releaseManager: 'Kumaran G.', releaseNotes: 'Real-time segment builder + saved cohorts.' },
  { type: 'release', color: '#0bb5c9', functionalityName: 'Template Builder Refresh', version: 'v5.2.1', releaseDate: '2026-05-21', module: 'Template Builder', releaseManager: 'Karthick V.', releaseNotes: 'Drag-and-drop blocks, AMP email support.' },
  { type: 'release', color: '#0f9d6b', functionalityName: 'Attribution Measurement', version: 'v5.3.0', releaseDate: '2026-06-12', module: 'Analytics', releaseManager: 'Balaji S.', releaseNotes: 'Seven-level attribution rollout.' },
  { type: 'release', color: '#e23d5a', functionalityName: 'OTP Timer Hotfix', version: 'v5.2.2', releaseDate: '2026-06-24', module: 'Communication', releaseManager: 'Arjun M.', releaseNotes: 'Fixes OTP countdown reset edge case.' },
  { type: 'release', color: '#f06a1e', functionalityName: 'Instagram Publishing', version: 'v1.4.0', releaseDate: '2026-06-30', module: 'Marketing Star', releaseManager: 'Priya N.', releaseNotes: 'Direct IG publishing — One Less Tab.' },
  { type: 'sprint', color: '#6c47d6', sprintName: 'Sprint 6', goal: 'Attribution module', startDate: '2026-05-05', endDate: '2026-05-16', teamNotes: 'Backend + Data' },
  { type: 'sprint', color: '#6c47d6', sprintName: 'Sprint 7', goal: 'Template builder', startDate: '2026-05-19', endDate: '2026-05-30', teamNotes: 'Frontend' },
  { type: 'sprint', color: '#2f54eb', sprintName: 'Sprint 8', goal: 'Marketing Star GA', startDate: '2026-06-09', endDate: '2026-06-20', teamNotes: 'Full squad' },
  { type: 'leave', color: '#e23d5a', developerName: 'Priya N.', leaveType: 'Planned Leave', fromDate: '2026-05-14', toDate: '2026-05-15', duration: 'full', notes: 'Family function' },
  { type: 'leave', color: '#e23d5a', developerName: 'Arjun M.', leaveType: 'Sick Leave', fromDate: '2026-06-18', toDate: '2026-06-18', duration: 'first', notes: '' },
  { type: 'leave', color: '#e23d5a', developerName: 'Rahul K.', leaveType: 'Comp Off', fromDate: '2026-06-23', toDate: '2026-06-23', duration: 'full', notes: 'Weekend on-call' },
];
