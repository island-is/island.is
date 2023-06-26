export interface PlateOwnership {
  regno: string
  startDate: Date
  endDate: Date
  nationalId: string
  name: string
}

export interface PlateOwnershipValidation {
  hasError: boolean
  errorMessages?: Array<PlateOwnershipValidationMessage> | null
}

export interface PlateOwnershipValidationMessage {
  errorNo?: string | null
  defaultMessage?: string | null
}
