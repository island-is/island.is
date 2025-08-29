import { Field, ObjectType, Int } from '@nestjs/graphql'
import { Section } from './section.model'
import { LanguageType } from './languageType.model'
import { Dependency } from './form.model'
import { ValueDto } from './value.model'
import { FormCertificationTypeDto } from './certification.model'
import { FormApplicantTypeDto } from './applicant.model'
import { Option } from './option.model'

@ObjectType('FormSystemApplicationEventDto')
export class ApplicationEventDto {
  @Field(() => String, { nullable: true })
  eventType?: string

  @Field(() => Boolean, { nullable: true })
  isFileEvent?: boolean

  @Field(() => Date, { nullable: true })
  created?: Date
}

@ObjectType('FormSystemApplication')
export class Application {
  @Field(() => String)
  id!: string

  @Field(() => LanguageType, { nullable: true })
  organizationName?: LanguageType

  @Field(() => String, { nullable: true })
  formId?: string

  @Field(() => LanguageType, { nullable: true })
  formName?: LanguageType

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

  @Field(() => [Dependency], { nullable: 'itemsAndList' })
  dependencies?: Dependency[]

  @Field(() => [String], { nullable: 'itemsAndList' })
  completed?: string[]

  @Field(() => String, { nullable: true })
  status?: string

  @Field(() => Boolean, { nullable: true })
  stopProgressOnValidatingScreen?: boolean

  @Field(() => Boolean, { nullable: true })
  hasSummaryScreen?: boolean

  @Field(() => Boolean, { nullable: true })
  hasPayment?: boolean

  @Field(() => [ApplicationEventDto], { nullable: 'itemsAndList' })
  events?: ApplicationEventDto[]

  @Field(() => [Section], { nullable: 'itemsAndList' })
  sections?: Section[]

  @Field(() => [ValueDto], { nullable: 'itemsAndList' })
  files?: ValueDto[]

  @Field(() => [FormCertificationTypeDto], { nullable: 'itemsAndList' })
  certificationTypes?: FormCertificationTypeDto[]

  @Field(() => [FormApplicantTypeDto], { nullable: 'itemsAndList' })
  applicantTypes?: FormApplicantTypeDto[]
}

@ObjectType('FormSystemApplicationListDto')
export class ApplicationListDto {
  @Field(() => [Application], { nullable: 'itemsAndList' })
  applications?: Application[]

  @Field(() => Int, { nullable: true })
  total?: number
}

@ObjectType('FormSystemSubmitScreenResponseValue')
export class SubmitScreenResponseValue {
  @Field(() => Boolean, { nullable: true })
  isValid?: boolean

  @Field(() => String, { nullable: true })
  valueId?: string

  @Field(() => LanguageType, { nullable: true })
  message?: LanguageType
}

@ObjectType('FormSystemSubmitScreenResponseField')
export class SubmitScreenResponseField {
  @Field(() => Boolean, { nullable: true })
  isValid?: boolean

  @Field(() => String, { nullable: true })
  fieldId?: string

  @Field(() => LanguageType, { nullable: true })
  message?: LanguageType

  @Field(() => [SubmitScreenResponseValue], { nullable: 'itemsAndList' })
  values?: SubmitScreenResponseValue[]
}

@ObjectType('FormSystemSubmitScreenResponse')
export class SubmitScreenResponse {
  @Field(() => Boolean, { nullable: true })
  isValid?: boolean

  @Field(() => String, { nullable: true })
  screenId?: string

  @Field(() => String, { nullable: true })
  applicationId?: string

  @Field(() => LanguageType, { nullable: true })
  message?: LanguageType

  @Field(() => [SubmitScreenResponseField], { nullable: 'itemsAndList' })
  fields?: SubmitScreenResponseField[]
}

@ObjectType('FormSystemApplicationResponse')
export class ApplicationResponse {
  @Field(() => [Application], { nullable: 'itemsAndList' })
  applications?: Application[]

  @Field(() => Application, { nullable: true })
  application?: Application

  @Field(() => Number, { nullable: true })
  total?: number

  @Field(() => [Option], { nullable: 'itemsAndList' })
  organizations?: Option[]
}
