const configuredBase =
    import.meta.env.VITE_API_BASE ||
    import.meta.env.VITE_API_URL ||
    "/api";

export const API_BASE = configuredBase.trim().replace(/\/$/, ""); 