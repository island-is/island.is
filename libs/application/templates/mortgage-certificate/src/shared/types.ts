export type SelectedProperty = {
  propertyNumber: string
  propertyName: string
  propertyType: string
}

export interface MortgageCertificateValidation {
  propertyNumber: string
  exists: boolean
  hasKMarking: boolean
}
