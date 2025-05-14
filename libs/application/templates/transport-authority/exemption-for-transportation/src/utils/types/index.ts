// TODOx move into client

export interface ApplicationRulesLimitations {
  maxHeight: number
  maxWidth: number
  maxLength: number
  maxWeight: number
  maxTotalLength: number
}

export interface ApplicationRules {
  policeEscort: {
    height: number
    width: number
    length: number
  }
  shortTermMeasurementLimitations: ApplicationRulesLimitations
  longTermMeasurementLimitations: ApplicationRulesLimitations
}
