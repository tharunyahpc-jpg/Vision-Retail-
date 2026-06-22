// ============================================================================
// Config layer — flip `useApi` to true and point `apiBase` at the backend
// (the Express server in ../backend) to use the office database instead of the
// browser's localStorage demo store.
// ============================================================================
export const CONFIG = {
  useApi: false,
  apiBase: 'http://localhost:4000/api',
};

export const LS_KEY = 'resul_release_calendar_v1';
