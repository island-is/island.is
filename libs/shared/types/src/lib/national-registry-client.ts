/**
 * These are copied from '@island.is/clients/national-registry-v2' to get rid of circular dependencies.
 * Needs to be manually kept in sync. Using these types in `@island.is/api/domains/national-registry-x-road` to
 * get TypeScript errors when the types don't match.
 * Would be nice to extend the client module to map these to english-language DTOs.
 */

export interface NationalRegistryClientAddress {
  streetAddress: string
  postalCode: string | null
  locality: string | null
  municipalityNumber: string | null
}

export interface NationalRegistryClientPerson {
  nationalId: string
  name: string
  givenName: string | null
  middleName: string | null
  familyName: string | null
  fullName: string | null
  genderCode: string
  exceptionFromDirectMarketing: boolean
  birthdate: Date
  legalDomicile: NationalRegistryClientAddress | null
  residence: NationalRegistryClientAddress | null
}
