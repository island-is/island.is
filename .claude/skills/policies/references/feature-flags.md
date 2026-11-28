# Feature flags (FLAG)

Sources: [Feature flags](https://docs.devland.is/development/feature-flags.md), [ADR 0013](https://docs.devland.is/technical-overview/adr/0013-feature-flags.md)

- **FLAG-1** New user-facing features ship behind a flag: on in dev, off in staging and prod until release.
- **FLAG-2** Read flags only through `@island.is/feature-flags` and `@island.is/nest/feature-flags` (`@FeatureFlag` guard, `FeatureFlagService`, or the client hooks). Never use the ConfigCat SDK directly, and never ship an SDK key or user data to the browser for flag evaluation.
- **FLAG-3** Register keys in `libs/feature-flags/src/lib/features.ts` with descriptive names.
- **FLAG-4** Flags are created, changed and deleted in ConfigCat by people, not agents. Code PRs may remove flag usage once the flag is on everywhere; deleting the flag itself is a separate, manual step.
- **FLAG-5** Server-side env toggles go through the service's infra DSL (`.features()`), not ad-hoc env reads.
