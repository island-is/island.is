import { Field, ObjectType } from '@nestjs/graphql'
import { Dependency, LanguageType } from '@island.is/form-system-dataTypes'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { ApplicationEventDto } from './applicationEvent.dto'
import { SectionDto } from '../sections/section.dto'
import { ValueDto } from './value.dto'
import { FormCertificationTypeDto } from '../formCertificationTypes/formCertificationType.dto'
import { FormApplicantTypeDto } from '../formApplicantTypes/formApplicantType.dto'

@ObjectType('FormSystemApplication')
export class ApplicationDto {
  @ApiPropertyOptional()
  @Field(() => String, { nullable: true })
  id?: string

  @ApiPropertyOptional({ type: LanguageType })
  @Field(() => LanguageType, { nullable: true })
  organizationName?: LanguageType

  @ApiPropertyOptional()
  @Field(() => String, { nullable: true })
  formId?: string

  @ApiPropertyOptional({ type: LanguageType })
  @Field(() => LanguageType, { nullable: true })
  formName?: LanguageType

  @ApiPropertyOptional()
  @Field(() => Boolean, { nullable: true })
  isTest?: boolean

  @ApiPropertyOptional()
  @Field(() => String, { nullable: true })
  slug?: string

  @ApiPropertyOptional({ type: Date })
  @Field(() => Date, { nullable: true })
  created?: Date

  @ApiPropertyOptional({ type: Date })
  @Field(() => Date, { nullable: true })
  modified?: Date

  @ApiPropertyOptional({ type: Date })
  @Field(() => Date, { nullable: true })
  submittedAt?: Date

  @ApiPropertyOptional({ type: [Dependency] })
  @Field(() => [Dependency], { nullable: 'itemsAndList' })
  dependencies?: Dependency[]

  @ApiPropertyOptional({ type: [String] })
  @Field(() => [String], { nullable: 'itemsAndList' })
  completed?: string[]

  @ApiPropertyOptional()
  @Field(() => String, { nullable: true })
  status?: string

  @ApiPropertyOptional({ type: [ApplicationEventDto] })
  @Field(() => [ApplicationEventDto], { nullable: 'itemsAndList' })
  events?: ApplicationEventDto[]

  @ApiPropertyOptional({ type: [SectionDto] })
  @Field(() => [SectionDto], { nullable: 'itemsAndList' })
  sections?: SectionDto[]

  @ApiPropertyOptional({ type: [ValueDto] })
  @Field(() => [ValueDto], { nullable: 'itemsAndList' })
  files?: ValueDto[]

  @ApiPropertyOptional({ type: [FormCertificationTypeDto] })
  @Field(() => [FormCertificationTypeDto], { nullable: 'itemsAndList' })
  certificationTypes?: FormCertificationTypeDto[]

  @ApiPropertyOptional({ type: [FormApplicantTypeDto] })
  @Field(() => [FormApplicantTypeDto], { nullable: 'itemsAndList' })
  applicantTypes?: FormApplicantTypeDto[]
}
