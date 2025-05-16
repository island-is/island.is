import { Field, InputType } from '@nestjs/graphql'
import { OrganizationInput } from './organization.input'
import { SectionInput } from './section.input'
import { DependencyInput } from './form.input'

@InputType('FormSystemCreateApplicationDtoInput')
export class CreateApplicationDtoInput {
  @Field(() => Boolean, { nullable: true })
  isTest?: boolean
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

  @Field(() => OrganizationInput, { nullable: true })
  organization?: OrganizationInput

  @Field(() => String, { nullable: true })
  formId?: string

  @Field(() => String, { nullable: true })
  slug?: string

  @Field(() => Date, { nullable: true })
  created?: Date

  @Field(() => Date, { nullable: true })
  modified?: Date

  @Field(() => Date, { nullable: true })
  submittedAt?: Date

  @Field(() => [DependencyInput], { nullable: true })
  dependencies?: DependencyInput[]

  @Field(() => [String], { nullable: 'itemsAndList' })
  completed?: string[]

  @Field(() => String, { nullable: true })
  status?: string

  @Field(() => [ApplicationEventDtoInput], { nullable: true })
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
