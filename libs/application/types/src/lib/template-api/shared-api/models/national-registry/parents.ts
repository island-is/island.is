export interface NationalRegistryParent {
  nationalId: string
  fullName: string
  legalDomicile?: {
    streetAddress: string
    postalCode: string | null
    locality: string | null
    municipalityNumber: string | null
  } | null
}
