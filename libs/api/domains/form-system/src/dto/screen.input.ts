import { Field, InputType, Int } from '@nestjs/graphql'
import { LanguageTypeInput } from './languageType.input'
import { FieldInput } from './field.input'
import { ValidationErrorInput } from './validationError.input'

@InputType('FormSystemCreateScreenDtoInput')
export class CreateScreenDtoInput {
  @Field(() => String, { nullable: true })
  sectionId?: string

  @Field(() => Int, { nullable: true })
  displayOrder?: number
}

@InputType('FormSystemCreateScreenInput')
export class CreateScreenInput {
  @Field(() => CreateScreenDtoInput, { nullable: true })
  createScreenDto?: CreateScreenDtoInput
}

@InputType('FormSystemUpdateScreenDtoInput')
export class UpdateSectionDtoInput {
  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => Int, { nullable: true })
  multiset?: number

  @Field(() => Boolean, { nullable: true })
  shouldValidate?: boolean

  @Field(() => Boolean, { nullable: true })
  shouldPopulate?: boolean
}

@InputType('FormSystemUpdateScreenInput')
export class UpdateScreenInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => UpdateSectionDtoInput, { nullable: true })
  updateScreenDto?: UpdateSectionDtoInput
}

@InputType('FormSystemDeleteScreenInput')
export class DeleteScreenInput {
  @Field(() => String)
  id!: string
}

@InputType('FormSystemScreenDisplayOrderInput')
export class ScreenDisplayOrderInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  sectionId?: string
}

@InputType('FormSystemUpdateScreenDisplayOrderDtoInput')
export class UpdateScreenDisplayOrderDtoInput {
  @Field(() => [ScreenDisplayOrderInput], { nullable: 'itemsAndList' })
  screensDisplayOrderDto?: ScreenDisplayOrderInput[]
}

@InputType('FormSystemUpdateScreensDisplayOrderInput')
export class UpdateScreensDisplayOrderInput {
  @Field(() => UpdateScreenDisplayOrderDtoInput, { nullable: true })
  updateScreensDisplayOrderDto?: UpdateScreenDisplayOrderDtoInput
}

@InputType('FormSystemScreenInput')
export class ScreenInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  sectionId?: string

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => Int, { nullable: true })
  displayOrder?: number

  @Field(() => Boolean, { nullable: true })
  isHidden?: boolean

  @Field(() => Boolean, { nullable: true })
  isCompleted?: boolean

  @Field(() => Int, { nullable: true })
  multiset?: number

  @Field(() => Boolean, { nullable: true })
  shouldValidate?: boolean

  @Field(() => Boolean, { nullable: true })
  shouldPopulate?: boolean

  @Field(() => ValidationErrorInput, { nullable: true })
  screenError?: ValidationErrorInput

  @Field(() => [FieldInput], { nullable: 'itemsAndList' })
  fields?: FieldInput[]
}
