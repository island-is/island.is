import { Field, ID, InputType, Int } from '@nestjs/graphql'
import { LanguageTypeInput } from './language.input'
import graphqlTypeJson from 'graphql-type-json'
import { DocumentTypeUpdateInput } from './documentType.input'
import { FormApplicantTypeInput } from './applicantType.input'

@InputType('FormSystemFormSettingsInput')
export class FormSettingsInput {
  @Field(() => Int, { nullable: true })
  id?: number

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => Date, { nullable: true })
  lastChanged?: Date

  @Field(() => Date, { nullable: true })
  invalidationDate?: Date | null

  @Field(() => graphqlTypeJson, { nullable: true })
  dependencies?: { [key: string]: string[] } | null

  @Field(() => [DocumentTypeUpdateInput], { nullable: 'itemsAndList' })
  formDocumentTypes?: DocumentTypeUpdateInput[] | null

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

  @Field(() => ID, { nullable: true })
  guid?: string
}

@InputType('FormSystemUpdateFormSettingsInput')
export class UpdateFormSettingsInput {
  @Field(() => Int)
  id!: number

  @Field(() => FormSettingsInput)
  formSettingsUpdateDto!: FormSettingsInput
}
