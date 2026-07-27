/**
 * Stand-in for `@island.is/api/mocks` when API_MOCKS is not enabled, so the
 * mock service worker and its faker dependency stay out of the bundle
 * (see the alias in vite.config.ts).
 */
export {}
