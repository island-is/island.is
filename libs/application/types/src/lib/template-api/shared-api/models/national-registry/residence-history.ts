export interface NationalRegistryResidenceHistory {
  city: string | null
  postalCode?: string | null
  streetName: string
  municipalityCode: string | null
  houseIdentificationCode: string
  realEstateNumber: string | null
  country: string | null
  dateOfChange: Date | null
}
