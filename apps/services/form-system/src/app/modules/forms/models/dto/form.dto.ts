import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { ScreenDto } from '../../../screens/models/dto/screen.dto'
import { FieldDto } from '../../../fields/models/dto/field.dto'
import { SectionDto } from '../../../sections/models/dto/section.dto'
import { Dependency } from '../../../../dataTypes/dependency.model'
import { FormApplicantTypeDto } from '../../../formApplicantTypes/models/dto/formApplicantType.dto'
import { FormCertificationTypeDto } from '../../../formCertificationTypes/models/dto/formCertificationType.dto'

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
  hasPayment!: boolean

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

  @ApiPropertyOptional()
  isZendeskEnabled?: boolean

  @ApiPropertyOptional({ type: LanguageType })
  completedMessage?: LanguageType

  @ApiPropertyOptional({ type: [Dependency] })
  dependencies?: Dependency[]

  @ApiPropertyOptional({ type: [FormCertificationTypeDto] })
  certificationTypes?: FormCertificationTypeDto[]

  @ApiPropertyOptional({ type: [FormApplicantTypeDto] })
  applicantTypes?: FormApplicantTypeDto[]

  @ApiPropertyOptional({ type: [String] })
  urls?: string[]

  @ApiPropertyOptional({ type: [SectionDto] })
  sections?: SectionDto[]

  @ApiPropertyOptional({ type: [ScreenDto] })
  screens?: ScreenDto[]

  @ApiPropertyOptional({ type: [FieldDto] })
  fields?: FieldDto[]
}
