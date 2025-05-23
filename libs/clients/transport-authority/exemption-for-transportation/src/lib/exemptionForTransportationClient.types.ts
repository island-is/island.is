interface ExemptionRulesPoliceEscort {
  maxHeight: number
  maxWidth: number
  maxLength: number
}

export interface ExemptionRulesLimitations {
  maxHeight: number
  maxWidth: number
  maxLength: number
  maxWeight: number
  maxTotalLength: number
}

export interface ExemptionRules {
  policeEscort: ExemptionRulesPoliceEscort
  shortTermMeasurementLimitations: ExemptionRulesLimitations
  longTermMeasurementLimitations: ExemptionRulesLimitations
}

export interface ExemptionValidation {
  isInspected: boolean
  isInOrder: boolean
  errorMessages?: Array<ExemptionValidationMessage> | null
}

export interface ExemptionValidationMessage {
  errorNo?: string | null
  defaultMessage?: string | null
}
