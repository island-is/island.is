import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { CompletedSectionInfo } from '../../../../dataTypes/completedSectionInfo.model'
import { Dependency } from '../../../../dataTypes/dependency.model'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { FieldDto } from '../../../fields/models/dto/field.dto'
import { FormCertificationTypeDto } from '../../../formCertificationTypes/models/dto/formCertificationType.dto'
import { ScreenDto } from '../../../screens/models/dto/screen.dto'
import { SectionDto } from '../../../sections/models/dto/section.dto'

export class FormDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  organizationId!: string

  @ApiProperty()
  organizationNationalId!: string

  @ApiPropertyOptional()
  organizationTitle?: string

  @ApiPropertyOptional()
  organizationTitleEn?: string

  @ApiPropertyOptional({ type: LanguageType })
  organizationDisplayName?: LanguageType

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
  zendeskInternal!: boolean

  @ApiProperty()
  submissionServiceUrl!: string

  @ApiProperty()
  hasPayment!: boolean

  @ApiProperty()
  beenPublished!: boolean

  @ApiProperty()
  isTranslated!: boolean

  @ApiProperty()
  daysUntilApplicationPrune!: number

  @ApiProperty()
  derivedFrom!: string

  @ApiProperty()
  status!: string

  @ApiProperty()
  allowProceedOnValidationFail!: boolean

  @ApiProperty()
  hasSummaryScreen!: boolean

  @ApiProperty({ type: CompletedSectionInfo })
  completedSectionInfo!: CompletedSectionInfo

  @ApiPropertyOptional({ type: [Dependency] })
  dependencies?: Dependency[]

  @ApiPropertyOptional({ type: [FormCertificationTypeDto] })
  certificationTypes?: FormCertificationTypeDto[]

  @ApiPropertyOptional({ type: [SectionDto] })
  sections?: SectionDto[]

  @ApiPropertyOptional({ type: [ScreenDto] })
  screens?: ScreenDto[]

  @ApiPropertyOptional({ type: [FieldDto] })
  fields?: FieldDto[]
}
