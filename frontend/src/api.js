const configuredBase = import.meta.env.VITE_API_BASE?.trim();

export const API_BASE = (configuredBase || '/api').replace(/\/$/, '');
