import { Field, InputType } from '@nestjs/graphql'
import { FieldSettingsInput } from './fieldSettings.input'
import { LanguageTypeInput } from './languageType.input'
import { ValueInput } from './value.input'

@InputType('FormSystemFieldTypeInput')
export class FieldTypeInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => LanguageTypeInput, { nullable: true })
  description?: LanguageTypeInput

  @Field(() => Boolean, { nullable: true })
  isCommon?: boolean

  @Field(() => FieldSettingsInput, { nullable: true })
  fieldSettings?: FieldSettingsInput

  @Field(() => [ValueInput], { nullable: 'itemsAndList' })
  values?: ValueInput[]
}
