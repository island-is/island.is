import { ApiPropertyOptional } from '@nestjs/swagger'
import { SectionDto } from '../../../sections/models/dto/section.dto'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { Dependency } from '../../../../dataTypes/dependency.model'
import { ApplicationStatus } from '../../../../enums/applicationStatus'

export class ApplicationDto {
  @ApiPropertyOptional()
  id?: string

  @ApiPropertyOptional({ type: LanguageType })
  organizationName?: LanguageType

  @ApiPropertyOptional()
  formId?: string

  @ApiPropertyOptional({ type: LanguageType })
  formName?: LanguageType

  @ApiPropertyOptional()
  isTest?: boolean

  @ApiPropertyOptional()
  slug?: string

  @ApiPropertyOptional({ type: Date })
  created?: Date

  @ApiPropertyOptional({ type: Date })
  modified?: Date

  @ApiPropertyOptional({ type: [Dependency] })
  dependencies?: Dependency[]

  @ApiPropertyOptional({ type: [String] })
  completed?: string[]

  @ApiPropertyOptional({ enum: ApplicationStatus })
  status?: string

  @ApiPropertyOptional({ type: [SectionDto] })
  sections?: SectionDto[]
}
