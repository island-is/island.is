import { Field, ID, InputType, Int } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'
import { LanguageTypeInput } from './language.input'
import { InputInput } from './inputs.input'
import { GroupInput } from './groups.input'
import { StepInput } from './steps.input'
import { FormApplicantTypeInput } from './applicantType.input'
import { DocumentTypeInput } from './documentType.input'
import { OrganizationInput } from './organization.input'

@InputType('FormSystemGetFormInput')
export class GetFormInput {
  @Field(() => Int)
  id!: number
}

@InputType('FormSystemGetFormsInput')
export class GetFormsInput {
  @Field(() => Int)
  organizationId!: number
}

@InputType('FormSystemCreateFormInput')
export class CreateFormInput {
  @Field(() => Int)
  organizationId!: number
}

@InputType('FormSystemDeleteFormInput')
export class DeleteFormInput {
  @Field(() => Int)
  id!: number
}

@InputType('FormSystemFormInput')
export class FormInput {
  @Field(() => Int, { nullable: true })
  id?: number

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => OrganizationInput, { nullable: true })
  organization?: OrganizationInput

  @Field(() => Date, { nullable: true })
  created?: Date

  @Field(() => Date, { nullable: true })
  lastChanged?: Date

  @Field(() => Date, { nullable: true })
  invalidationDate?: Date | null

  @Field(() => graphqlTypeJson, { nullable: true })
  dependencies?: { [key: string]: string[] } | null

  @Field(() => [DocumentTypeInput], { nullable: 'itemsAndList' })
  documentTypes?: DocumentTypeInput[] | null

  @Field(() => [FormApplicantTypeInput], { nullable: 'itemsAndList' })
  formApplicantTypes?: FormApplicantTypeInput[] | null

  @Field(() => LanguageTypeInput, { nullable: true })
  completedMessage?: LanguageTypeInput

  @Field(() => Boolean, { nullable: true })
  isTranslated?: boolean | null

  @Field(() => Boolean, { nullable: true })
  stopProgressOnValidatingStep?: boolean | null

  @Field(() => Int, { nullable: true })
  applicationsDaysToRemove?: number

  @Field(() => [StepInput], { nullable: 'itemsAndList' })
  steps?: StepInput[] | null

  @Field(() => [StepInput], { nullable: 'itemsAndList' })
  stepsList?: StepInput[] | null

  @Field(() => [GroupInput], { nullable: 'itemsAndList' })
  groupsList?: GroupInput[] | null

  @Field(() => [InputInput], { nullable: 'itemsAndList' })
  inputsList?: InputInput[] | null

  @Field(() => ID, { nullable: true })
  guid?: string
}

@InputType('FormSystemUpdateFormInput')
export class UpdateFormInput {
  @Field(() => Int, { nullable: true })
  formId!: number

  @Field(() => FormInput, { nullable: true })
  form?: FormInput
}
