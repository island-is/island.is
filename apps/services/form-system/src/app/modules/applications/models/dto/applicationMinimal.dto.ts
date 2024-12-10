import { ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { Dependency } from '../../../../dataTypes/dependency.model'
import { ApplicationStatus } from '../../../../enums/applicationStatus'
import { ValueDto } from '../../../values/models/dto/value.dto'
import { ApplicationEventDto } from './applicationEvent.dto'

export class ApplicationMinimalDto {
  @ApiPropertyOptional()
  id?: string

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

  @ApiPropertyOptional({ type: [ValueDto] })
  files?: ValueDto[]
}
