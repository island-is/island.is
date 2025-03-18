import { Field, InputType, Int } from '@nestjs/graphql'
import { FieldSettingsInput } from './fieldSettings.input'
import { LanguageTypeInput } from './languageType.input'
import { ListItemInput } from './listItem.input'
import { ValueDtoInput } from './value.input'

@InputType('CreateFormSystemFieldDtoInput')
export class CreateFieldDtoInput {
  @Field(() => String, { nullable: true })
  screenId?: string

  @Field(() => String, { nullable: true })
  fieldType?: string

  @Field(() => Int, { nullable: true })
  displayOrder?: number
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

  @Field(() => Boolean, { nullable: true })
  isRequired?: boolean

  @Field(() => Boolean, { nullable: true })
  isHidden?: boolean

  @Field(() => FieldSettingsInput, { nullable: true })
  fieldSettings?: FieldSettingsInput

  @Field(() => String, { nullable: true })
  fieldType?: string
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

  @Field(() => Boolean, { nullable: true })
  isHidden?: boolean

  @Field(() => Boolean, { nullable: true })
  isRequired?: boolean

  @Field(() => FieldSettingsInput, { nullable: true })
  fieldSettings?: FieldSettingsInput

  @Field(() => String, { nullable: true })
  fieldType?: string

  @Field(() => [ListItemInput], { nullable: 'itemsAndList' })
  list?: ListItemInput[]

  @Field(() => [ValueDtoInput], { nullable: 'itemsAndList' })
  values?: ValueDtoInput[]
}
