import { Field, InputType } from '@nestjs/graphql'
import { FormApplicantTypeDtoInput } from './applicant.input'
import { FormCertificationTypeDtoInput } from './certification.input'
import { CompletedSectionInfoInput } from './completedSectionInfo.input'
import { DependencyInput } from './form.input'
import { LanguageTypeInput } from './languageType.input'
import { ScreenInput } from './screen.input'
import { SectionInput } from './section.input'
import { ValueInput } from './value.input'

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

  @Field(() => String, { nullable: true })
  slug?: string
}

@InputType('FormSystemApplicationsInput')
export class ApplicationsInput {
  @Field(() => String, { nullable: true })
  organizationNationalId?: string

  @Field(() => Number, { nullable: true })
  page?: number

  @Field(() => Number, { nullable: true })
  limit?: number

  @Field(() => Boolean, { nullable: false })
  isTest!: boolean
}

@InputType('FormSystemGetApplicationsInput')
export class GetApplicationsInput {
  @Field(() => String, { nullable: true })
  slug?: string
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

@InputType('FormSystemApplicationDtoInput')
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

  @Field(() => Boolean, { nullable: true })
  allowProceedOnValidationFail?: boolean

  @Field(() => [ApplicationEventDtoInput], { nullable: 'itemsAndList' })
  events?: ApplicationEventDtoInput[]

  @Field(() => [SectionInput], { nullable: 'itemsAndList' })
  sections?: SectionInput[]

  @Field(() => [ValueInput], { nullable: 'itemsAndList' })
  files?: ValueInput[]

  @Field(() => [FormCertificationTypeDtoInput], { nullable: 'itemsAndList' })
  certificationTypes?: FormCertificationTypeDtoInput[]

  @Field(() => [FormApplicantTypeDtoInput], { nullable: 'itemsAndList' })
  applicantTypes?: FormApplicantTypeDtoInput[]

  @Field(() => CompletedSectionInfoInput, { nullable: true })
  completedSectionInfo?: CompletedSectionInfoInput
}

@InputType('UpdateFormSystemApplicationDependenciesInput')
export class UpdateApplicationDependenciesInput {
  @Field(() => [DependencyInput], { nullable: 'itemsAndList' })
  dependencies?: DependencyInput[]

  @Field(() => [String], { nullable: 'itemsAndList' })
  completed?: string[]
}

@InputType('UpdateFormSystemApplicationInput')
export class UpdateApplicationInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => UpdateApplicationDependenciesInput, { nullable: true })
  updateApplicationDto?: UpdateApplicationDependenciesInput
}

@InputType('SaveFormSystemScreenInput')
export class SubmitScreenDtoInput {
  @Field(() => String, { nullable: true })
  applicationId?: string

  @Field(() => ScreenInput, { nullable: true })
  screenDto?: ScreenInput
}

@InputType('SubmitFormSystemScreenInput')
export class SubmitScreenInput {
  @Field(() => String, { nullable: true })
  screenId?: string

  @Field(() => SubmitScreenDtoInput, { nullable: true })
  submitScreenDto?: SubmitScreenDtoInput
}

@InputType('SubmitFormSystemSectionInput')
export class SubmitSectionInput {
  @Field(() => String, { nullable: true })
  applicationId?: string

  @Field(() => String, { nullable: true })
  sectionId?: string
}
