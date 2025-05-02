export interface NationalRegistryCustodian {
  nationalId: string
  name: string | null
  legalDomicile?: {
    streetAddress: string
    postalCode: string | null
    locality: string | null
    municipalityNumber: string | null
  } | null
}
