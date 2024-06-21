import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { LanguageType } from './global.model'
import { Group } from './group.model'
import { Input } from './input.model'
import { Step } from './step.model'
import { Organization } from './organization.model'
import { DocumentType } from './documentType.model'
import graphqlTypeJson from 'graphql-type-json'
import { FormApplicantType } from './formApplicantType.model'

export type Dependencies = {
  [key: string]: string[]
}

@ObjectType('FormSystemForm')
export class Form {
  @Field(() => Int, { nullable: true })
  id?: number

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => Organization, { nullable: true })
  organization?: Organization

  @Field(() => Date, { nullable: true })
  created?: Date

  @Field(() => Date, { nullable: true })
  lastChanged?: Date

  @Field(() => Date, { nullable: true })
  invalidationDate?: Date | null

  @Field(() => graphqlTypeJson, { nullable: true })
  dependencies?: { [key: string]: string[] } | null

  @Field(() => [DocumentType], { nullable: 'itemsAndList' })
  documentTypes?: DocumentType[] | null

  @Field(() => [FormApplicantType], { nullable: 'itemsAndList' })
  formApplicantTypes?: FormApplicantType[] | null

  @Field(() => LanguageType, { nullable: true })
  completedMessage?: LanguageType

  @Field(() => Boolean, { nullable: true })
  isTranslated?: boolean | null

  @Field(() => Boolean, { nullable: true })
  stopProgressOnValidatingStep?: boolean | null

  @Field(() => Int, { nullable: true })
  applicationsDaysToRemove?: number

  @Field(() => [Step], { nullable: 'itemsAndList' })
  steps?: Step[] | null

  @Field(() => [Step], { nullable: 'itemsAndList' })
  stepsList?: Step[] | null

  @Field(() => [Group], { nullable: 'itemsAndList' })
  groupsList?: Group[] | null

  @Field(() => [Input], { nullable: 'itemsAndList' })
  inputsList?: Input[] | null

  @Field(() => ID, { nullable: true })
  guid?: string
}
