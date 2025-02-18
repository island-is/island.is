import { LanguageType } from './languageType.model'

export class ScreenValidationResponse {
  isValid!: boolean
  screenId!: string
  applicationId!: string
  message!: LanguageType
  fields!: FieldValidation[]
}

export class FieldValidation {
  isValid!: boolean
  fieldId!: string
  message!: LanguageType
  values!: ValueValidation[]
}

export class ValueValidation {
  isValid!: boolean
  valueId!: string
  message!: LanguageType
}
