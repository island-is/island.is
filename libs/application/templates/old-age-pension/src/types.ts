export interface residenceHistory {
  city: string
  postalCode?: string
  streetName: string
  municipalityCode: string
  houseIdentificationCode: string
  realEstateNumber: string
  country: string
  dateOfChange: Date
}

export interface combinedResidenceHistory {
  country: string
  periodFrom: Date
  periodTo: Date | string
}
