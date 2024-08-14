import { Field, ID, InputType, Int } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'
import { LanguageTypeInput } from './OLDlanguage.input'
import { InputInput } from './OLDinputs.input'
import { GroupInput } from './OLDgroups.input'
import { StepInput } from './OLDsteps.input'
import { FormApplicantTypeInput } from './applicantType.input'
import { DocumentTypeInput } from './OLDdocumentType.input'
import { OrganizationInput } from './OLDorganization.input'

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
