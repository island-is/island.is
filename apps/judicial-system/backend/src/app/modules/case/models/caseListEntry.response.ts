import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import {
  CaseAppealDecision,
  CaseAppealRulingDecision,
  CaseAppealState,
  CaseDecision,
  CaseState,
  CaseType,
} from '@island.is/judicial-system/types'

import { Defendant } from '../../defendant'
import { User } from '../../user'

export class CaseListEntry {
  @ApiProperty()
  id!: string

  @ApiProperty()
  created!: Date

  @ApiPropertyOptional()
  courtDate?: Date

  @ApiProperty()
  policeCaseNumbers!: string[]

  @ApiProperty({ enum: CaseState })
  state!: CaseState

  @ApiProperty({ enum: CaseType })
  type!: CaseType

  @ApiPropertyOptional({ type: () => Defendant, isArray: true })
  defendants?: Defendant[]

  @ApiPropertyOptional()
  courtCaseNumber?: string

  @ApiPropertyOptional({ enum: CaseDecision })
  decision?: CaseDecision

  @ApiPropertyOptional()
  validToDate?: Date

  @ApiPropertyOptional()
  requestedCourtDate?: Date

  @ApiPropertyOptional()
  initialRulingDate?: Date

  @ApiPropertyOptional()
  rulingDate?: Date

  @ApiPropertyOptional()
  rulingSignatureDate?: Date

  @ApiPropertyOptional()
  courtEndTime?: Date

  @ApiPropertyOptional({ enum: CaseAppealDecision })
  prosecutorAppealDecision?: CaseAppealDecision

  @ApiPropertyOptional({ enum: CaseAppealDecision })
  accusedAppealDecision?: CaseAppealDecision

  @ApiPropertyOptional()
  prosecutorPostponedAppealDate?: Date

  @ApiPropertyOptional()
  accusedPostponedAppealDate?: Date

  @ApiPropertyOptional()
  judgeId?: string

  @ApiPropertyOptional({ type: () => User })
  judge?: User

  @ApiPropertyOptional()
  prosecutorId?: string

  @ApiPropertyOptional({ type: () => User })
  prosecutor?: User

  @ApiPropertyOptional()
  registrarId?: string

  @ApiPropertyOptional({ type: () => User })
  registrar?: User

  @ApiPropertyOptional()
  creatingProsecutorId?: string

  @ApiPropertyOptional({ type: () => User })
  creatingProsecutor?: User

  @ApiPropertyOptional()
  parentCaseId?: string

  @ApiPropertyOptional()
  appealState?: CaseAppealState

  @ApiPropertyOptional()
  appealCaseNumber?: string

  @ApiPropertyOptional()
  appealRulingDecision?: CaseAppealRulingDecision
}
