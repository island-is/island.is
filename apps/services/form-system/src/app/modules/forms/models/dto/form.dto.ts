import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { FormApplicantDto } from '../../../formApplicants/models/dto/formApplicant.dto'
import { ScreenDto } from '../../../screens/models/dto/screen.dto'
import { FieldDto } from '../../../fields/models/dto/field.dto'
import { SectionDto } from '../../../sections/models/dto/section.dto'
import { CertificationDto } from '../../../certifications/models/dto/certification.dto'
import { Dependency } from '../../../../dataTypes/dependency.model'

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
  isTranslated!: boolean

  @ApiProperty()
  applicationDaysToRemove!: number

  @ApiProperty()
  derivedFrom!: number

  @ApiProperty()
  stopProgressOnValidatingScreen!: boolean

  @ApiPropertyOptional({ type: LanguageType })
  completedMessage?: LanguageType

  @ApiPropertyOptional({ type: [Dependency] })
  dependencies?: Dependency[]

  @ApiPropertyOptional({ type: [CertificationDto] })
  certificationTypes?: CertificationDto[]

  @ApiPropertyOptional({ type: [FormApplicantDto] })
  applicants?: FormApplicantDto[]

  @ApiPropertyOptional({ type: [SectionDto] })
  sections?: SectionDto[]

  @ApiPropertyOptional({ type: [ScreenDto] })
  screens?: ScreenDto[]

  @ApiPropertyOptional({ type: [FieldDto] })
  fields?: FieldDto[]
}
