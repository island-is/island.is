// import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { LanguageType } from './languageType.model'

// @InputType('FormSystemScreenValidationResponseInput')
// @ObjectType('FormSystemScreenValidationResponse')
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
