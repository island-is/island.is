import { ApiPropertyOptional } from '@nestjs/swagger'
import { CompletedSectionInfo } from '../../../../dataTypes/completedSectionInfo.model'
import { Dependency } from '../../../../dataTypes/dependency.model'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { FormCertificationTypeDto } from '../../../formCertificationTypes/models/dto/formCertificationType.dto'
import { SectionDto } from '../../../sections/models/dto/section.dto'
import { ApplicationEventDto } from './applicationEvent.dto'
import { ValueDto } from './value.dto'

export class ApplicationDto {
  @ApiPropertyOptional()
  id?: string

  @ApiPropertyOptional()
  nationalId?: string

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
  draftFinishedSteps?: number

  @ApiPropertyOptional()
  draftTotalSteps?: number

  @ApiPropertyOptional()
  allowProceedOnValidationFail?: boolean

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

  @ApiPropertyOptional({ type: CompletedSectionInfo })
  completedSectionInfo?: CompletedSectionInfo

  @ApiPropertyOptional()
  zendeskInternal?: boolean

  @ApiPropertyOptional()
  useValidate?: boolean

  @ApiPropertyOptional()
  usePopulate?: boolean

  @ApiPropertyOptional()
  submissionServiceUrl?: string
}
