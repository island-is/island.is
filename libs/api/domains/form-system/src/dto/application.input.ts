import { Field, InputType, Int } from '@nestjs/graphql'
import { OrganizationInput } from './organization.input'
import { SectionInput } from './section.input'
import { DependencyInput } from './form.input'
import { ValueDtoInput } from './value.input'
import { FormCertificationTypeDtoInput } from './certification.input'
import { FormApplicantTypeDtoInput } from './applicant.input'
import { LanguageTypeInput } from './languageType.input'

@InputType('FormSystemCreateApplicationDtoInput')
export class CreateApplicationDtoInput {
  @Field(() => Boolean, { nullable: true })
  isTest?: boolean
}

@InputType('FormSystemCreateApplicationInput')
export class CreateApplicationInput {
  @Field(() => String, { nullable: true })
  slug?: string

  @Field(() => CreateApplicationDtoInput, { nullable: true })
  createApplicationDto?: CreateApplicationDtoInput
}

@InputType('FormSystemGetApplicationInput')
export class GetApplicationInput {
  @Field(() => String, { nullable: true })
  id?: string
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

  @Field(() => [ValueDtoInput], { nullable: 'itemsAndList' })
  files?: ValueDtoInput[]

  @Field(() => [FormCertificationTypeDtoInput], { nullable: 'itemsAndList' })
  certificationTypes?: FormCertificationTypeDtoInput[]

  @Field(() => [FormApplicantTypeDtoInput], { nullable: 'itemsAndList' })
  applicantTypes?: FormApplicantTypeDtoInput[]
}

@InputType('FormSystemSubmitScreenInput')
export class SubmitScreenInput {
  @Field(() => String, { nullable: true })
  screenId?: string

  @Field(() => ApplicationInput, { nullable: true })
  applicationDto?: ApplicationInput
}