import { Field, ObjectType } from '@nestjs/graphql'
import { Section } from './section.model'
import { LanguageType } from './languageType.model'
import { Dependency } from './form.model'
import { Option } from './option.model'

@ObjectType('FormSystemApplicationEventDto')
export class ApplicationEventDto {
  @Field(() => Date, { nullable: true })
  created?: Date

  @Field(() => String, { nullable: true })
  eventType?: string

  @Field(() => Boolean, { nullable: true })
  isFileEvent?: boolean
}

@ObjectType('FormSystemApplicationResponse')
export class ApplicationResponse {
  @Field(() => [Application], { nullable: 'itemsAndList' })
  applications?: Application[]

  @Field(() => Number, { nullable: true })
  total?: number

  @Field(() => [Option], { nullable: 'itemsAndList' })
  organizations?: Option[]
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

  @Field(() => [ApplicationEventDto], { nullable: 'itemsAndList' })
  events?: ApplicationEventDto[]

  @Field(() => [Section], { nullable: 'itemsAndList' })
  sections?: Section[]
}
