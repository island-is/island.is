import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { FieldDtoFieldTypeEnum } from '@island.is/clients/form-system'
import { FieldSettingsInput } from './fieldSettings.input'
import { LanguageTypeInput } from './languageType.input'

registerEnumType(FieldDtoFieldTypeEnum, {
  name: 'FormSystemFieldDtoFieldTypeEnum'
})

@InputType('FormSystemUpdateFieldInput')
export class UpdateFieldInput {
  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => LanguageTypeInput, { nullable: true })
  description?: LanguageTypeInput

  @Field(() => Boolean, { nullable: true })
  isPartOfMultiset?: boolean

  @Field(() => FieldSettingsInput, { nullable: true })
  fieldSettings?: FieldSettingsInput

  @Field(() => FieldDtoFieldTypeEnum, { nullable: true })
  fieldType?: FieldDtoFieldTypeEnum
}
