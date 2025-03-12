import { Field, InputType, Int } from '@nestjs/graphql'
import { LanguageTypeInput } from './languageType.input'
import { SectionInput } from './section.input'
import { DependencyInput } from './form.input'

@InputType('CreateFormSystemApplicationDtoInput')
export class CreateApplicationDtoInput {
  @Field(() => Boolean)
  isTest!: boolean
}

@InputType('CreateFormSystemApplicationInput')
export class CreateApplicationInput {
  @Field(() => String, { nullable: true })
  slug?: string

  @Field(() => CreateApplicationDtoInput, { nullable: true })
  createApplicationDto?: CreateApplicationDtoInput
}

@InputType('FormSystemApplicationInput')
export class GetApplicationInput {
  @Field(() => String, { nullable: true })
  id?: string
}

@InputType('SubmitFormSystemScreenInput')
export class SubmitScreenInput {
  @Field(() => String, { nullable: true })
  screenId?: string
}

@InputType('FormSystemApplicationEventDtoInput')
export class ApplicationEventDtoInput {
  @Field(() => Date, { nullable: true })
  created?: Date

  @Field(() => String, { nullable: true })
  eventType?: string

  @Field(() => Boolean, { nullable: true })
  isFileEvent?: boolean
}

@InputType('FormSystemApplicationInput')
export class ApplicationInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => LanguageTypeInput, { nullable: true })
  organizationName?: LanguageTypeInput

  @Field(() => String, { nullable: true })
  formId?: string

  @Field(() => LanguageTypeInput, { nullable: true })
  formName?: LanguageTypeInput

  @Field(() => Boolean, { nullable: true })
  isTest?: boolean

  @Field(() => String, { nullable: true })
  slug?: string

  @Field(() => Date, { nullable: true })
  created?: Date

  @Field(() => Date, { nullable: true })
  modified?: Date

  @Field(() => Date, { nullable: true })
  submittedAt?: Date

  @Field(() => [DependencyInput], { nullable: 'itemsAndList' })
  dependencies?: DependencyInput[]

  @Field(() => [String], { nullable: 'itemsAndList' })
  completed?: string[]

  @Field(() => String, { nullable: true })
  status?: string

  @Field(() => [ApplicationEventDtoInput], { nullable: 'itemsAndList' })
  events?: ApplicationEventDtoInput[]

  @Field(() => [SectionInput], { nullable: 'itemsAndList' })
  sections?: SectionInput[]
}

@InputType('UpdateFormSystemApplicationDependenciesInput')
export class UpdateApplicationDependenciesInput {
  @Field(() => [DependencyInput], { nullable: 'itemsAndList' })
  dependencies?: DependencyInput[]

  @Field(() => [String], { nullable: 'itemsAndList' })
  completed?: string[]
}