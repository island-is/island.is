import { Dependency, LanguageType } from '@island.is/form-system-dataTypes'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { FormCertificationTypeDto } from '../formCertificationTypes/formCertificationType.dto'
import { FormApplicantTypeDto } from '../formApplicantTypes/formApplicantType.dto'
import { FormUrlDto } from '../formUrls/formUrl.dto'
import { SectionDto } from '../sections/section.dto'
import { ScreenDto } from '../screens/screen.dto'
import { FieldDto } from '../fields/field.dto'

export class FormDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  organizationId!: string

  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty()
  slug!: string

  @ApiPropertyOptional({ type: Date })
  invalidationDate?: Date

  @ApiProperty({ type: Date })
  created!: Date

  @ApiProperty({ type: Date })
  modified!: Date

  @ApiProperty()
  beenPublished!: boolean

  @ApiProperty()
  isTranslated!: boolean

  @ApiProperty()
  applicationDaysToRemove!: number

  @ApiProperty()
  derivedFrom!: string

  @ApiProperty()
  status!: string

  @ApiProperty()
  stopProgressOnValidatingScreen!: boolean

  @ApiPropertyOptional({ type: LanguageType })
  completedMessage?: LanguageType

  @ApiPropertyOptional({ type: [Dependency] })
  dependencies?: Dependency[]

  @ApiPropertyOptional({ type: [FormCertificationTypeDto] })
  certificationTypes?: FormCertificationTypeDto[]

  @ApiPropertyOptional({ type: [FormApplicantTypeDto] })
  applicantTypes?: FormApplicantTypeDto[]

  @ApiPropertyOptional({ type: [FormUrlDto] })
  urls?: FormUrlDto[]

  @ApiPropertyOptional({ type: [SectionDto] })
  sections?: SectionDto[]

  @ApiPropertyOptional({ type: [ScreenDto] })
  screens?: ScreenDto[]

  @ApiPropertyOptional({ type: [FieldDto] })
  fields?: FieldDto[]
}
