import { ApiPropertyOptional } from '@nestjs/swagger'
import { SectionDto } from '../../../sections/models/dto/section.dto'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { Dependency } from '../../../../dataTypes/dependency.model'
import { ApplicationEventDto } from './applicationEvent.dto'
import { ValueDto } from './value.dto'
import { FormCertificationTypeDto } from '../../../formCertificationTypes/models/dto/formCertificationType.dto'

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

  @ApiPropertyOptional({ type: Date })
  submittedAt?: Date

  @ApiPropertyOptional({ type: [Dependency] })
  dependencies?: Dependency[]

  @ApiPropertyOptional({ type: [String] })
  completed?: string[]

  @ApiPropertyOptional()
  status?: string

  @ApiPropertyOptional()
  stopProgressOnValidatingScreen?: boolean

  @ApiPropertyOptional()
  hasSummaryScreen?: boolean

  @ApiPropertyOptional()
  hasPayment?: boolean

  @ApiPropertyOptional({ type: [ApplicationEventDto] })
  events?: ApplicationEventDto[]

  @ApiPropertyOptional({ type: [SectionDto] })
  sections?: SectionDto[]

  @ApiPropertyOptional({ type: [ValueDto] })
  files?: ValueDto[]

  @ApiPropertyOptional({ type: [FormCertificationTypeDto] })
  certificationTypes?: FormCertificationTypeDto[]
}
