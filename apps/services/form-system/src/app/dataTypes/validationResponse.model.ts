export class ScreenValidationResponse {
  screenValidationPassed!: boolean
  screenId!: string
  applicationId!: string
  screenMessage!: string
  fields!: FieldValidationResponse[]
}

export class FieldValidationResponse {
  fieldValidationPassed!: boolean
  fieldId!: string
  fieldMessage!: string
  values!: ValueValidationResponse[]
}

export class ValueValidationResponse {
  valueValidationPassed!: boolean
  valueId!: string
  valueMessage!: string
}
