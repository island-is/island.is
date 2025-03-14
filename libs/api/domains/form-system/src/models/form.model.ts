import { Field, ObjectType, Int } from '@nestjs/graphql'
import { Field as FieldModel } from './field.model'
import {
  FormCertificationType,
  FormCertificationTypeDto,
} from './certification.model'
import { FormApplicant } from './formApplicant.model'
import { Section } from './section.model'
import { ListType } from './listItem.model'
import { LanguageType } from './languageType.model'
import { Screen as ScreenModel } from './screen.model'
import { FieldType } from './fieldType.model'
import { Organization } from './organization.model'
import { Option } from './option.model'

@ObjectType('FormSystemDependency')
export class Dependency {
  @Field(() => String, { nullable: true })
  parentProp?: string

  @Field(() => [String], { nullable: 'itemsAndList' })
  childProps?: string[]

  @Field(() => Boolean, { nullable: true })
  isSelected?: boolean
}

@ObjectType('FormSystemFormUrl')
export class FormUrl {
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

@ObjectType('FormSystemForm')
export class Form {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  organizationId?: string

  @Field(() => String, { nullable: true })
  organizationNationalId?: string

  @Field(() => String, { nullable: true })
  organizationTitle?: string

  @Field(() => String, { nullable: true })
  organizationTitleEn?: string

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

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
  beenPublished?: boolean

  @Field(() => Int, { nullable: true })
  applicationDaysToRemove?: number

  @Field(() => Int, { nullable: true })
  derivedFrom?: number

  @Field(() => Boolean, { nullable: true })
  stopProgressOnValidatingScreen?: boolean

  @Field(() => LanguageType, { nullable: true })
  completedMessage?: LanguageType

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

  @Field(() => String, { nullable: true })
  status?: string

  @Field(() => [FormUrl], { nullable: 'itemsAndList' })
  urls?: FormUrl[]
}

@ObjectType('FormSystemOrganizationUrl')
export class OrganizationUrl {
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

  @Field(() => [OrganizationUrl], { nullable: 'itemsAndList' })
  urls?: OrganizationUrl[]

  @Field(() => [Option], { nullable: 'itemsAndList' })
  organizations?: Option[]
}
