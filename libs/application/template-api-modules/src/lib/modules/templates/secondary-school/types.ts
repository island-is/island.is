export interface EmailRecipient {
  nationalId: string
  name: string
  email?: string
}

//TODOx move into client
export interface ApplicationRules {
  policeEscort: {
    height: number
    width: number
    length: number
  }
  shortTermMeasurementLimitations: {
    maxHeight: number
    maxWidth: number
    maxLength: number
    maxWeight: number
    maxTotalLength: number
  }
  longTermMeasurementLimitations: {
    maxHeight: number
    maxWidth: number
    maxLength: number
    maxWeight: number
    maxTotalLength: number
  }
}
