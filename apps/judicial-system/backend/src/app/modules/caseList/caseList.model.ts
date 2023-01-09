import { ApiProperty } from '@nestjs/swagger'
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript'

import {
  CaseAppealDecision,
  CaseDecision,
  CaseListEntry as TCaseListEntry,
  CaseState,
  CaseType,
} from '@island.is/judicial-system/types'

import { Defendant } from '../defendant/models/defendant.model'
import { User } from '../user'
import { Case } from '../case'

@Table({
  tableName: 'case',
  timestamps: true,
})
export class CaseListEntry extends Model {
  @ApiProperty()
  id!: string

  /**********
   * The date and time the case was created in the Database
   **********/
  @ApiProperty()
  created!: Date

  /**********
   * The scheduled date and time of the case's court session
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  courtDate?: string

  /**********
   * A case number in LÖKE (police information system) connected to the case
   **********/
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  @ApiProperty()
  policeCaseNumbers!: string[]

  /**********
   * The case state - example: DRAFT
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(CaseState),
    defaultValue: CaseState.NEW,
  })
  @ApiProperty({ enum: CaseState })
  state!: CaseState

  /**********
   * The case type - example: CUSTODY
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(CaseType),
  })
  type!: CaseType

  /**********
   * The case's defendants
   **********/
  @HasMany(() => Defendant, 'caseId')
  @ApiProperty({ type: Defendant, isArray: true })
  defendants?: Defendant[]

  /**********
   * The case number assigned in Auður (court information system)
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  courtCaseNumber?: string

  /**********
   * The judge's pending decision - example: ACCEPTING
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CaseDecision),
  })
  @ApiProperty({ enum: CaseDecision })
  decision?: CaseDecision

  /**********
   * The ruling expiration date and time - example: the end of custody in custody cases -
   * autofilled from requestedValidToDate - possibly modified by the court - only used for
   * custody and travel ban cases
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  validToDate?: Date

  /**********
   * The prosecutor's requested court date and time
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  requestedCourtDate?: Date

  /**********
   * The date and time of the judge's inital ruling signature - used for extended cases
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  initialRulingDate?: Date

  /**********
   * The date and time of the judge's ruling signature
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  rulingDate?: Date

  /**********
   * The date and time the court session ended
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  courtEndTime?: Date

  /**********
   * The prosecutor's appeal decision - example: POSTPONE
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CaseAppealDecision),
  })
  @ApiProperty({ enum: CaseAppealDecision })
  prosecutorAppealDecision?: CaseAppealDecision

  /**********
   * The accused's appeal decision - example: APPEAL
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CaseAppealDecision),
  })
  @ApiProperty({ enum: CaseAppealDecision })
  accusedAppealDecision?: CaseAppealDecision

  /**********
   * The date and time of the prosecutor's postponed appeal - only used if the prosecutor
   * postponed his appeal decision and later appealed within the allowed time frame
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  prosecutorPostponedAppealDate?: Date

  /**********
   * The date and time of the accused's postponed appeal - only used if the accused postponed
   * her appeal decision and later appealed within the allowed time frame
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  accusedPostponedAppealDate?: Date

  /**********
   * The surrogate key of the judge assigned to the case
   **********/
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiProperty()
  judgeId?: string

  /**********
   * The judge assigned to the case
   **********/
  @BelongsTo(() => User, 'judgeId')
  @ApiProperty({ type: User })
  judge?: User

  /**********
   * The surrogate key of the prosecutor assigned to the case
   **********/
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiProperty()
  prosecutorId?: string

  /**********
   * The prosecutor assigned to the case
   **********/
  @BelongsTo(() => User, 'prosecutorId')
  @ApiProperty({ type: User })
  prosecutor?: User

  /**********
   * The surrogate key of the registrar assigned to the case
   **********/
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiProperty()
  registrarId?: string

  /**********
   * The registrar assigned to the case
   **********/
  @BelongsTo(() => User, 'registrarId')
  @ApiProperty({ type: User })
  registrar?: User

  /**********
   * The surrogate key of the prosecutor that created the case
   **********/
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiProperty()
  creatingProsecutorId?: string

  /**********
   * The prosecutor that created the case
   **********/
  @BelongsTo(() => User, 'creatingProsecutorId')
  @ApiProperty({ type: User })
  creatingProsecutor?: User

  /**********
   * The surrogate key of the case's parent case - only used if the case is an extension
   **********/
  @ForeignKey(() => Case)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiProperty()
  parentCaseId?: string

  /**********
   * The case's parent case - only used if the case is an extension
   **********/
  @BelongsTo(() => Case, 'parentCaseId')
  @ApiProperty({ type: Case })
  parentCase?: Case

  @ApiProperty()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isArchived!: boolean
}
