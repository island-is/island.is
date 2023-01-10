import { ApiProperty } from '@nestjs/swagger'

import {
  CaseAppealDecision,
  CaseDecision,
  CaseState,
  CaseType,
} from '@island.is/judicial-system/types'

import { Defendant } from '../../defendant'
import { User } from '../../user'
import { Case } from './case.model'

export class CaseListEntry {
  @ApiProperty()
  id!: string

  @ApiProperty()
  created!: Date

  @ApiProperty()
  courtDate?: Date

  @ApiProperty()
  policeCaseNumbers!: string[]

  @ApiProperty({ enum: CaseState })
  state!: CaseState

  @ApiProperty({ enum: CaseType })
  type!: CaseType

  @ApiProperty({ type: Defendant, isArray: true })
  defendants?: Defendant[]

  @ApiProperty()
  courtCaseNumber?: string

  @ApiProperty({ enum: CaseDecision })
  decision?: CaseDecision

  @ApiProperty()
  validToDate?: Date

  @ApiProperty()
  requestedCourtDate?: Date

  @ApiProperty()
  initialRulingDate?: Date

  @ApiProperty()
  rulingDate?: Date

  @ApiProperty()
  courtEndTime?: Date

  @ApiProperty({ enum: CaseAppealDecision })
  prosecutorAppealDecision?: CaseAppealDecision

  @ApiProperty({ enum: CaseAppealDecision })
  accusedAppealDecision?: CaseAppealDecision

  @ApiProperty()
  prosecutorPostponedAppealDate?: Date

  @ApiProperty()
  accusedPostponedAppealDate?: Date

  @ApiProperty()
  judgeId?: string

  @ApiProperty({ type: User })
  judge?: User

  @ApiProperty()
  prosecutorId?: string

  @ApiProperty({ type: User })
  prosecutor?: User

  @ApiProperty()
  registrarId?: string

  @ApiProperty({ type: User })
  registrar?: User

  @ApiProperty()
  creatingProsecutorId?: string

  @ApiProperty({ type: User })
  creatingProsecutor?: User

  @ApiProperty()
  parentCaseId?: string
}
