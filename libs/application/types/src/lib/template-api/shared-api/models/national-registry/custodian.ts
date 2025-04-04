export interface NationalRegistryCustodian {
  nationalId: string
  givenName: string | null
  familyName: string | null
  legalDomicile?: {
    streetAddress: string
    postalCode: string | null
    locality: string | null
    municipalityNumber: string | null
  } | null
}
