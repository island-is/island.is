import { Field, ObjectType } from '@nestjs/graphql'
import { Dependency, LanguageType } from '@island.is/form-system-dataTypes'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { FormCertificationTypeDto } from '../formCertificationTypes/formCertificationType.dto'
import { FormApplicantTypeDto } from '../formApplicantTypes/formApplicantType.dto'
import { FormUrlDto } from '../formUrls/formUrl.dto'
import { SectionDto } from '../sections/section.dto'
import { ScreenDto } from '../screens/screen.dto'
import { FieldDto } from '../fields/field.dto'

@ObjectType('FormSystemForm')
export class FormDto {
  @ApiProperty()
  @Field(() => String)
  id!: string

  @ApiProperty()
  @Field(() => String)
  organizationId!: string

  @ApiProperty({ type: LanguageType })
  @Field(() => LanguageType)
  name!: LanguageType

  @ApiProperty()
  @Field(() => String)
  slug!: string

  @ApiPropertyOptional({ type: Date })
  @Field(() => Date, { nullable: true })
  invalidationDate?: Date

  @ApiProperty({ type: Date })
  @Field(() => Date)
  created!: Date

  @ApiProperty({ type: Date })
  @Field(() => Date)
  modified!: Date

  @ApiProperty()
  @Field(() => Boolean)
  beenPublished!: boolean

  @ApiProperty()
  @Field(() => Boolean)
  isTranslated!: boolean

  @ApiProperty()
  @Field(() => Number)
  applicationDaysToRemove!: number

  @ApiProperty()
  @Field(() => String)
  derivedFrom!: string

  @ApiProperty()
  @Field(() => String)
  status!: string

  @ApiProperty()
  @Field(() => Boolean)
  stopProgressOnValidatingScreen!: boolean

  @ApiPropertyOptional({ type: LanguageType })
  @Field(() => LanguageType)
  completedMessage?: LanguageType

  @ApiPropertyOptional({ type: [Dependency] })
  @Field(() => [Dependency], { nullable: 'itemsAndList' })
  dependencies?: Dependency[]

  @ApiPropertyOptional({ type: [FormCertificationTypeDto] })
  @Field(() => [FormCertificationTypeDto], { nullable: 'itemsAndList' })
  certificationTypes?: FormCertificationTypeDto[]

  @ApiPropertyOptional({ type: [FormApplicantTypeDto] })
  @Field(() => [FormApplicantTypeDto], { nullable: 'itemsAndList' })
  applicantTypes?: FormApplicantTypeDto[]

  @ApiPropertyOptional({ type: [FormUrlDto] })
  @Field(() => [FormUrlDto], { nullable: 'itemsAndList' })
  urls?: FormUrlDto[]

  @ApiPropertyOptional({ type: [SectionDto] })
  @Field(() => [SectionDto], { nullable: 'itemsAndList' })
  sections?: SectionDto[]

  @ApiPropertyOptional({ type: [ScreenDto] })
  @Field(() => [ScreenDto], { nullable: 'itemsAndList' })
  screens?: ScreenDto[]

  @ApiPropertyOptional({ type: [FieldDto] })
  @Field(() => [FieldDto], { nullable: 'itemsAndList' })
  fields?: FieldDto[]
}
