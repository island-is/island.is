export interface PlateOwnership {
  regno: string
  startDate?: Date | null
  endDate?: Date | null
}

export interface PlateOwnershipValidation {
  hasError: boolean
  errorMessages?: Array<PlateOwnershipValidationMessage> | null
}

export interface PlateOwnershipValidationMessage {
  errorNo?: string | null
  defaultMessage?: string | null
}
