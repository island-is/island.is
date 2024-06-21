import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { FormApplicantDto } from '../../../applicants/models/dto/formApplicant.dto'
import { GroupDto } from '../../../groups/models/dto/group.dto'
import { InputDto } from '../../../inputs/models/dto/input.dto'
import { StepDto } from '../../../steps/models/dto/step.dto'
import { FormTestimonyTypeDto } from '../../../testimonies/models/dto/formTestimonyType.dto'

export class FormDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  organizationId!: string

  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty()
  invalidationDate?: Date

  @ApiProperty()
  created!: Date

  @ApiProperty()
  modified!: Date

  @ApiProperty()
  isTranslated!: boolean

  @ApiProperty()
  applicationDaysToRemove!: number

  @ApiProperty()
  derivedFrom!: number

  @ApiProperty()
  stopProgressOnValidatingStep!: boolean

  @ApiProperty({ type: LanguageType })
  completedMessage?: LanguageType

  @ApiProperty({ type: [FormTestimonyTypeDto] })
  testimonyTypes?: FormTestimonyTypeDto[]

  @ApiProperty({ type: [FormApplicantDto] })
  applicants?: FormApplicantDto[]

  @ApiProperty({ type: [StepDto] })
  steps?: StepDto[]

  @ApiProperty({ type: [GroupDto] })
  groups?: GroupDto[]

  @ApiProperty({ type: [InputDto] })
  inputs?: InputDto[]
}
