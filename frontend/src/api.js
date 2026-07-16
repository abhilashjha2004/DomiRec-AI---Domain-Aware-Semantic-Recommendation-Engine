const configuredBase = import.meta.env.VITE_API_BASE?.trim() || import.meta.env.VITE_API_URL?.trim();

let resolvedBase = '/api';

if (configuredBase) {
  if (configuredBase.startsWith('http://') || configuredBase.startsWith('https://')) {
    // If it's a full URL, append /api if it's not already there
    resolvedBase = configuredBase.endsWith('/api') 
      ? configuredBase 
      : `${configuredBase.replace(/\/$/, '')}/api`;
  } else {
    resolvedBase = configuredBase;
  }
}

export const API_BASE = resolvedBase.replace(/\/$/, '');
