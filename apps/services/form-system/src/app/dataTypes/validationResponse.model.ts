import { ApiProperty } from '@nestjs/swagger'
import { Field, ObjectType } from '@nestjs/graphql'
import { LanguageType } from './languageType.model'

@ObjectType('FormSystemValueValidation')
export class ValueValidation {
  @ApiProperty()
  @Field()
  isValid!: boolean

  @ApiProperty()
  @Field()
  valueId!: string

  @ApiProperty({ type: LanguageType })
  @Field(() => LanguageType)
  message!: LanguageType
}

@ObjectType('FormSystemFieldValidation')
export class FieldValidation {
  @ApiProperty()
  @Field()
  isValid!: boolean

  @ApiProperty()
  @Field()
  fieldId!: string

  @ApiProperty({ type: LanguageType })
  @Field(() => LanguageType)
  message!: LanguageType

  @ApiProperty({ type: [ValueValidation] })
  @Field(() => [ValueValidation])
  values!: ValueValidation[]
}

@ObjectType('FormSystemScreenValidationResponse')
export class ScreenValidationResponse {
  @ApiProperty()
  @Field()
  isValid!: boolean

  @ApiProperty()
  @Field()
  screenId!: string

  @ApiProperty()
  @Field()
  applicationId!: string

  @ApiProperty({ type: LanguageType })
  @Field(() => LanguageType)
  message!: LanguageType

  @ApiProperty({ type: [FieldValidation] })
  @Field(() => [FieldValidation])
  fields!: FieldValidation[]
}
