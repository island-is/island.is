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

@InputType('FormSystemCreateFormInput')
export class CreateFormInput {
  @Field(() => String, { nullable: true })
  organizationId?: string
}

@InputType('FormSystemDeleteFormInput')
export class DeleteFormInput {
  @Field(() => String, { nullable: true })
  id?: string
}

@InputType('FormSystemGetFormInput')
export class GetFormInput {
  @Field(() => String, { nullable: true })
  id?: string
}

@InputType('FormSystemGetAllFormsInput')
export class GetAllFormsInput {
  @Field(() => String, { nullable: true })
  organizationId?: string
}

@InputType('FormSystemUpdateFormDtoInput')
export class UpdateFormDtoInput {
  @Field(() => String, { nullable: true })
  organizationId?: string

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => String, { nullable: true })
  slug?: string

  @Field(() => Date, { nullable: true })
  invalidationDate?: Date

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
