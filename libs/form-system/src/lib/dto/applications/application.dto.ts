import { Dependency, LanguageType } from '@island.is/form-system-dataTypes'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { ApplicationEventDto } from './applicationEvent.dto'
import { SectionDto } from '../sections/section.dto'
import { ValueDto } from './value.dto'
import { FormCertificationTypeDto } from '../formCertificationTypes/formCertificationType.dto'
import { FormApplicantTypeDto } from '../formApplicantTypes/formApplicantType.dto'

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

  @ApiPropertyOptional({ type: [ApplicationEventDto] })
  events?: ApplicationEventDto[]

  @ApiPropertyOptional({ type: [SectionDto] })
  sections?: SectionDto[]

  @ApiPropertyOptional({ type: [ValueDto] })
  files?: ValueDto[]

  @ApiPropertyOptional({ type: [FormCertificationTypeDto] })
  certificationTypes?: FormCertificationTypeDto[]

  @ApiPropertyOptional({ type: [FormApplicantTypeDto] })
  applicantTypes?: FormApplicantTypeDto[]
}
