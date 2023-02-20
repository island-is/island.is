export type PlateOwnership = {
  regno: string
  validationErrorMessages?: Array<PlateOwnershipValidationMessage> | null
}

export type PlateOwnershipValidationMessage = {
  errorNo?: string | null
  defaultMessage?: string | null
}
