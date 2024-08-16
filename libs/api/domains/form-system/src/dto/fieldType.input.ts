import { Field, InputType, registerEnumType } from "@nestjs/graphql"
import { FieldTypeDtoTypeEnum } from "@island.is/clients/form-system"
import { FieldSettingsInput } from "./fieldSettings.input"
import { LanguageTypeInput } from "./languageType.input"

registerEnumType(FieldTypeDtoTypeEnum, {
  name: 'FormSystemFieldTypeDtoTypeEnum'
})

@InputType('FormSystemFieldTypeInput')
export class FieldTypeInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => FieldTypeDtoTypeEnum, { nullable: true })
  type?: FieldTypeDtoTypeEnum

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => LanguageTypeInput, { nullable: true })
  description?: LanguageTypeInput

  @Field(() => Boolean, { nullable: true })
  isCommon?: boolean

  @Field(() => FieldSettingsInput, { nullable: true })
  fieldSettings?: FieldSettingsInput
}
