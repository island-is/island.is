import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql'
import { FieldDtoFieldTypeEnum } from '@island.is/clients/form-system'
import { FieldSettingsInput } from './fieldSettings.input'
import { LanguageTypeInput } from './languageType.input'

registerEnumType(FieldDtoFieldTypeEnum, {
  name: 'FormSystemFieldDtoFieldTypeEnum',
})

@InputType('FormSystemCreateFieldDtoInput')
export class CreateFieldDtoInput {
  @Field(() => String, { nullable: true })
  screenId?: string
}

@InputType('FormSystemCreateFieldInput')
export class CreateFieldInput {
  @Field(() => CreateFieldDtoInput, { nullable: true })
  createFieldDto?: CreateFieldDtoInput
}

@InputType('FormSystemDeleteFieldInput')
export class DeleteFieldInput {
  @Field(() => String, { nullable: true })
  id?: string
}

@InputType('FormSystemFieldDisplayOrderInput')
export class FieldDisplayOrderInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  screenId?: string
}

@InputType('FormSystemUpdateFieldsDisplayOrderInput')
export class UpdateFieldsDisplayOrderInput {
  @Field(() => [FieldDisplayOrderInput], { nullable: 'itemsAndList' })
  updateFieldsDisplayOrderDto?: FieldDisplayOrderInput[]
}

@InputType('FormSystemUpdateFieldDtoInput')
export class UpdateFieldDtoInput {
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

@InputType('FormSystemUpdateFieldInput')
export class UpdateFieldInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => UpdateFieldDtoInput, { nullable: true })
  updateFieldDto?: UpdateFieldDtoInput
}

@InputType()
@InputType('FormSystemFieldInput')
export class FieldInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  screenId?: string

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => Int, { nullable: true })
  displayOrder?: number

  @Field(() => LanguageTypeInput, { nullable: true })
  description?: LanguageTypeInput

  @Field(() => Boolean, { nullable: true })
  isPartOfMultiset?: boolean

  @Field(() => FieldSettingsInput, { nullable: true })
  fieldSettings?: FieldSettingsInput

  @Field(() => FieldDtoFieldTypeEnum, { nullable: true })
  fieldType?: FieldDtoFieldTypeEnum

  @Field(() => Boolean, { nullable: true })
  isRequired?: boolean
}
