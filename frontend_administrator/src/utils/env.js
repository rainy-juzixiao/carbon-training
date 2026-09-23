export function getBaseUrl() {
    return import.meta.env.PROD || import.meta.env.STAGING
        ? import.meta.env.VITE_APP_BASE_URL
        : import.meta.env.VITE_APP_BASE_API;
}
