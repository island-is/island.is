import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql'
import { LanguageType } from "../models/LanguageType.model"
import { FieldDtoFieldTypeEnum } from '@island.is/clients/form-system'
import { FieldSettingsInput } from './fieldSettings.input'

registerEnumType(FieldDtoFieldTypeEnum, {
  name: 'FormSystemFieldDtoFieldTypeEnum'
})

@InputType('FormSystemFieldInput')
export class FieldInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  screenId?: string

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => Int, { nullable: true })
  displayOrder?: number

  @Field(() => LanguageType, { nullable: true })
  description?: LanguageType

  @Field(() => Boolean, { nullable: true })
  isPartOfMultiset?: boolean

  @Field(() => FieldSettingsInput, { nullable: true })
  fieldSettings?: FieldSettingsInput

  @Field(() => FieldDtoFieldTypeEnum, { nullable: true })
  fieldType?: FieldDtoFieldTypeEnum
}
