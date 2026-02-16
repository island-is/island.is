import { Field, Int, ObjectType } from '@nestjs/graphql'
import {
  FormCertificationType,
  FormCertificationTypeDto,
} from './certification.model'
import { CompletedSectionInfo } from './completedSectionInfo'
import { Field as FieldModel } from './field.model'
import { FieldType } from './fieldType.model'
import { FormApplicant } from './formApplicant.model'
import { LanguageType } from './languageType.model'
import { ListType } from './listItem.model'
import { Option } from './option.model'
import { Screen as ScreenModel } from './screen.model'
import { Section } from './section.model'

@ObjectType('FormSystemDependency')
export class Dependency {
  @Field(() => String, { nullable: true })
  parentProp?: string

  @Field(() => [String], { nullable: 'itemsAndList' })
  childProps?: string[]

  @Field(() => Boolean, { nullable: true })
  isSelected?: boolean
}

@ObjectType('FormSystemForm')
export class Form {
  @Field(() => String)
  id!: string

  @Field(() => String, { nullable: true })
  organizationId?: string

  @Field(() => String, { nullable: true })
  organizationNationalId?: string

  @Field(() => String, { nullable: true })
  organizationTitle?: string

  @Field(() => String, { nullable: true })
  organizationTitleEn?: string

  @Field(() => LanguageType, { nullable: true })
  organizationDisplayName?: LanguageType

  @Field(() => Date, { nullable: true })
  invalidationDate?: Date

  @Field(() => Boolean, { nullable: true })
  zendeskInternal?: boolean

  @Field(() => String, { nullable: true })
  submissionServiceUrl?: string

  @Field(() => Boolean, { nullable: true })
  hasPayment?: boolean

  @Field(() => Boolean, { nullable: true })
  beenPublished?: boolean

  @Field(() => Int, { nullable: true })
  derivedFrom?: number

  @Field(() => LanguageType)
  name!: LanguageType

  @Field(() => String, { nullable: true })
  slug?: string

  @Field(() => Date)
  created!: Date

  @Field(() => Date)
  modified!: Date

  @Field(() => Boolean)
  isTranslated!: boolean

  @Field(() => Int)
  daysUntilApplicationPrune!: number

  @Field(() => Boolean)
  allowProceedOnValidationFail!: boolean

  @Field(() => Boolean)
  hasSummaryScreen!: boolean

  @Field(() => CompletedSectionInfo, { nullable: true })
  completedSectionInfo?: CompletedSectionInfo

  @Field(() => [FormCertificationTypeDto], { nullable: 'itemsAndList' })
  certificationTypes?: FormCertificationTypeDto[]

  @Field(() => [FormApplicant], { nullable: 'itemsAndList' })
  applicantTypes?: FormApplicant[]

  @Field(() => [Section], { nullable: 'itemsAndList' })
  sections?: Section[]

  @Field(() => [ScreenModel], { nullable: 'itemsAndList' })
  screens?: ScreenModel[]

  @Field(() => [FieldModel], { nullable: 'itemsAndList' })
  fields?: FieldModel[]

  @Field(() => [Dependency], { nullable: 'itemsAndList' })
  dependencies?: Dependency[]

  @Field(() => String)
  status!: string
}

@ObjectType('FormSystemFormResponse')
export class FormResponse {
  @Field(() => Form, { nullable: true })
  form?: Form

  @Field(() => [FieldType], { nullable: 'itemsAndList' })
  fieldTypes?: FieldType[]

  @Field(() => [FormCertificationType], { nullable: 'itemsAndList' })
  certificationTypes?: FormCertificationType[]

  @Field(() => [FormApplicant], { nullable: 'itemsAndList' })
  applicantTypes?: FormApplicant[]

  @Field(() => [ListType], { nullable: 'itemsAndList' })
  listTypes?: ListType[]

  @Field(() => [Form], { nullable: 'itemsAndList' })
  forms?: Form[]

  @Field(() => [String], { nullable: 'itemsAndList' })
  submissionUrls?: string[]

  @Field(() => [Option], { nullable: 'itemsAndList' })
  organizations?: Option[]
}
