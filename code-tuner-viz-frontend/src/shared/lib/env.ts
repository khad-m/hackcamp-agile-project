export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string | undefined,
  useMocks: (import.meta.env.VITE_USE_MOCKS as string | undefined)?.toLowerCase() === "true",
};
