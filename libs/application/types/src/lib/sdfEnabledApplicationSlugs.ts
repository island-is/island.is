/**
 * URL slugs that are served by the SDF Next app (`application-system-next`).
 *
 * Listed explicitly (not derived from `ApplicationConfigurations` in this module)
 * so middleware can import a small Edge bundle. Next.js Edge has been observed to
 * omit or partially evaluate very large configuration objects when only
 * `Object.values` is used, which incorrectly redirects SDF slugs to the legacy SPA.
 *
 * When adding `useSdf: true` to an entry in `ApplicationConfigurations`, add its
 * `slug` here — `sdfEnabledApplicationSlugs.spec.ts` enforces parity.
 */
export const SDF_ENABLED_APPLICATION_SLUGS: readonly string[] = [
  'example-inputs',
  'endurmat-brunabotamats2',
]
