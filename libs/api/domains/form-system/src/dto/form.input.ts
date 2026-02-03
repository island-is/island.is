import { Field, InputType, Int } from '@nestjs/graphql'
import { FormApplicantInput } from './applicant.input'
import {
  CertificationInput,
  FormCertificationTypeDtoInput,
} from './certification.input'
import { CompletedSectionInfoInput } from './completedSectionInfo.input'
import { FieldInput } from './field.input'
import { FieldTypeInput } from './fieldType.input'
import { LanguageTypeInput } from './languageType.input'
import { ListTypeInput } from './listType.input'
import { ScreenInput } from './screen.input'
import { SectionInput } from './section.input'

@InputType('FormSystemDependencyInput')
export class DependencyInput {
  @Field(() => String, { nullable: true })
  parentProp?: string

  @Field(() => [String], { nullable: 'itemsAndList' })
  childProps?: string[]

  @Field(() => Boolean, { nullable: true })
  isSelected?: boolean
}

@InputType('FormSystemCreateFormInput')
export class CreateFormInput {
  @Field(() => String, { nullable: true })
  organizationNationalId?: string
}

@InputType('FormSystemGetFormInput')
export class GetFormInput {
  @Field(() => String, { nullable: true })
  id?: string
}

@InputType('FormSystemGetFormsInput')
export class GetFormsInput {
  @Field(() => String, { nullable: true })
  nationalId?: string
}

@InputType('FormSystemUpdateFormDtoInput')
export class UpdateFormDtoInput {
  @Field(() => String, { nullable: true })
  organizationId?: string

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => String, { nullable: true })
  slug?: string

  @Field(() => LanguageTypeInput, { nullable: true })
  organizationDisplayName?: LanguageTypeInput

  @Field(() => Date, { nullable: true })
  invalidationDate?: Date

  @Field(() => Boolean, { nullable: true })
  zendeskInternal?: boolean

  @Field(() => String, { nullable: true })
  submissionServiceUrl?: string

  @Field(() => String, { nullable: true })
  validationServiceUrl?: string

  @Field(() => Boolean, { nullable: true })
  hasPayment?: boolean

  @Field(() => Boolean, { nullable: true })
  isTranslated?: boolean

  @Field(() => Int, { nullable: true })
  daysUntilApplicationPrune?: number

  @Field(() => Boolean, { nullable: true })
  allowProceedOnValidationFail?: boolean

  @Field(() => Boolean, { nullable: true })
  hasSummaryScreen?: boolean

  @Field(() => CompletedSectionInfoInput, { nullable: true })
  completedSectionInfo?: CompletedSectionInfoInput

  @Field(() => [DependencyInput], { nullable: 'itemsAndList' })
  dependencies?: DependencyInput[]

  @Field(() => String, { nullable: true })
  status?: string
}

@InputType('FormSystemUpdateFormInput')
export class UpdateFormInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => UpdateFormDtoInput, { nullable: true })
  updateFormDto?: UpdateFormDtoInput
}

@InputType('FormSystemFormInput')
export class FormInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  organizationId?: string

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => String, { nullable: true })
  slug?: string

  @Field(() => Date, { nullable: true })
  invalidationDate?: Date

  @Field(() => Date, { nullable: true })
  created?: Date

  @Field(() => Date, { nullable: true })
  modified?: Date

  @Field(() => Boolean, { nullable: true })
  isTranslated?: boolean

  @Field(() => Boolean, { nullable: true })
  hasPayment?: boolean

  @Field(() => Boolean, { nullable: true })
  beenPublished?: boolean

  @Field(() => Int, { nullable: true })
  daysUntilApplicationPrune?: number

  @Field(() => Int, { nullable: true })
  derivedFrom?: number

  @Field(() => Boolean, { nullable: true })
  allowProceedOnValidationFail?: boolean

  @Field(() => CompletedSectionInfoInput, { nullable: true })
  completedSectionInfo?: CompletedSectionInfoInput

  @Field(() => [FormCertificationTypeDtoInput], { nullable: 'itemsAndList' })
  certificationTypes?: FormCertificationTypeDtoInput[]

  @Field(() => [FormApplicantInput], { nullable: 'itemsAndList' })
  applicantTypes?: FormApplicantInput[]

  @Field(() => [SectionInput], { nullable: 'itemsAndList' })
  sections?: SectionInput[]

  @Field(() => [ScreenInput], { nullable: 'itemsAndList' })
  screens?: ScreenInput[]

  @Field(() => [FieldInput], { nullable: 'itemsAndList' })
  fields?: FieldInput[]

  @Field(() => [DependencyInput], { nullable: 'itemsAndList' })
  dependencies?: DependencyInput[]

  @Field(() => String, { nullable: true })
  status?: string
}

@InputType('FormSystemFormResponseInput')
export class FormResponseInput {
  @Field(() => FormInput, { nullable: true })
  form?: FormInput

  @Field(() => [FieldTypeInput], { nullable: 'itemsAndList' })
  fieldTypes?: FieldTypeInput[]

  @Field(() => [CertificationInput], { nullable: 'itemsAndList' })
  certificationTypes?: CertificationInput[]

  @Field(() => [FormApplicantInput], { nullable: 'itemsAndList' })
  applicantTypes?: FormApplicantInput[]

  @Field(() => [ListTypeInput], { nullable: 'itemsAndList' })
  listTypes?: ListTypeInput[]

  @Field(() => [FormInput], { nullable: 'itemsAndList' })
  forms?: FormInput[]
}
