import { Field, InputType, Int } from '@nestjs/graphql'
import { SectionInput } from './section.input'
import { ScreenInput } from './screen.input'
import { FieldInput } from './field.input'
import { LanguageTypeInput } from './languageType.input'
import { FieldTypeInput } from './fieldType.input'
import { ListTypeInput } from './listType.input'
import { FormApplicantInput } from './applicant.input'
import {
  CertificationInput,
  FormCertificationTypeDtoInput,
} from './certification.input'

@InputType('FormSystemDependencyInput')
export class DependencyInput {
  @Field(() => String, { nullable: true })
  parentProp?: string

  @Field(() => [String], { nullable: 'itemsAndList' })
  childProps?: string[]

  @Field(() => Boolean, { nullable: true })
  isSelected?: boolean
}

@InputType('FormSystemDeleteFormInput')
export class DeleteFormInput {
  @Field(() => String, { nullable: true })
  id?: string
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

@InputType('FormSystemFormUrlInput')
export class FormUrlInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  organizationUrlId?: string

  @Field(() => String, { nullable: true })
  url?: string

  @Field(() => Boolean, { nullable: true })
  isXroad?: boolean

  @Field(() => Boolean, { nullable: true })
  isTest?: boolean

  @Field(() => String, { nullable: true })
  type?: string

  @Field(() => String, { nullable: true })
  method?: string
}

@InputType('FormSystemOrganizationUrlInput')
export class OrganizationUrlInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  url?: string

  @Field(() => Boolean, { nullable: true })
  isXroad?: boolean

  @Field(() => Boolean, { nullable: true })
  isTest?: boolean

  @Field(() => String, { nullable: true })
  type?: string

  @Field(() => String, { nullable: true })
  method?: string
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
  hasPayment?: boolean

  @Field(() => Boolean, { nullable: true })
  isTranslated?: boolean

  @Field(() => Int, { nullable: true })
  applicationDaysToRemove?: number

  @Field(() => Boolean, { nullable: true })
  stopProgressOnValidatingScreen?: boolean

  @Field(() => LanguageTypeInput, { nullable: true })
  completedMessage?: LanguageTypeInput

  @Field(() => [DependencyInput], { nullable: 'itemsAndList' })
  dependencies?: DependencyInput[]

  @Field(() => String, { nullable: true })
  status?: string

  @Field(() => [FormUrlInput], { nullable: true })
  urls?: FormUrlInput[]
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
  applicationDaysToRemove?: number

  @Field(() => Int, { nullable: true })
  derivedFrom?: number

  @Field(() => Boolean, { nullable: true })
  stopProgressOnValidatingScreen?: boolean

  @Field(() => LanguageTypeInput, { nullable: true })
  completedMessage?: LanguageTypeInput

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

  @Field(() => [FormUrlInput], { nullable: 'itemsAndList' })
  urls?: FormUrlInput[]
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

  @Field(() => [OrganizationUrlInput], { nullable: 'itemsAndList' })
  urls?: OrganizationUrlInput[]
}
