import type { LawyerRegistryData } from '../repository'

// Lawyers that exist only for automated tests. Since #23730 every lawyer login
// needs a hit in the lawyer registry, and the registry is replaced from LMFÍ
// every night, so these are seeded locally by seeders/seed_lawyer_registry.js
// and re-added on every replacement in test environments (see populate in
// lawyerRegistry.service.ts). The national id is the one the e2e defender
// logs in with (apps/system-e2e/src/support/urls.ts). Keep the two lists in sync.
export const testLawyers: LawyerRegistryData[] = [
  {
    name: 'Test Verjandi',
    nationalId: '0909090909',
    email: 'testverjandi@dummy.dd',
    phoneNumber: '0000000',
    practice: 'Test Lögmannsstofa',
    isLitigator: true,
  },
]
