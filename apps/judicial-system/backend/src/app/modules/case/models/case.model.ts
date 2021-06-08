import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

import {
  CaseState,
  CaseCustodyProvisions,
  CaseAppealDecision,
  CaseCustodyRestrictions,
  CaseGender,
  CaseDecision,
  CaseType,
  AccusedPleaDecision,
} from '@island.is/judicial-system/types'

import { Institution } from '../../institution'
import { User } from '../../user'

@Table({
  tableName: 'case',
  timestamps: true,
})
export class Case extends Model<Case> {
  /**********
   * A surrogate key assigned by the database
   **********/
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id: string

  /**********
   * The date and time the case was created in the database
   **********/
  @CreatedAt
  @ApiProperty()
  created: Date

  /**********
   * The date and time the case was last updated in the database
   **********/
  @UpdatedAt
  @ApiProperty()
  modified: Date

  /**********
   * The case type - example: CUSTODY
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(CaseType),
  })
  type: CaseType

  /**********
   * A further description of the case type - optional
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  description: string

  /**********
   * The case state - exaample: DRAFT
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(CaseState),
    defaultValue: CaseState.NEW,
  })
  @ApiProperty({ enum: CaseState })
  state: CaseState

  /**********
   * A case number in LÖKE connected to the case
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  policeCaseNumber: string

  /**********
   * The national id of the accused
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  accusedNationalId: string

  /**********
   * The name of the accused
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  accusedName: string

  /**********
   * The address of the accused
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  accusedAddress: string

  /**********
   * The gender of the accused
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CaseGender),
  })
  accusedGender: CaseGender

  /**********
   * The name of the accused´s defender - optional
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  defenderName: string

  /**********
   * The email address of the accused´s defender - optional
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  defenderEmail: string

  /**********
   * The phone number of the accused's defender - optional
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  defenderPhoneNumber: string

  /**********
   * Indicates whether the prosecutor's request should be sent to the accused's defender
   * when a court date has been assigned to the case - optional
   **********/
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiProperty()
  sendRequestToDefender: boolean

  /**********
   * The surrogate key of the court assigned to the case
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  courtId: string

  /**********
   * The court assigned to the case
   **********/
  @BelongsTo(() => Institution, 'courtId')
  @ApiProperty({ type: Institution })
  court: Institution

  /**********
   * The lead investigator assigned to the case - usually name and title -
   * optional for most case types
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  leadInvestigator: string

  /**********
   * The date and time the accused was arrested - optional
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  arrestDate: Date

  /**********
   * The prosecutor's requested court date and time
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  requestedCourtDate: Date

  /**********
   * The prosecutor's requested ruling expiration date and time - example: the end of custody
   * in custody cases - optional for some case types
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  requestedValidToDate: Date

  /**********
   *
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  demands: string

  /**********
   *
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  lawsBroken: string

  /**********
   *
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  legalBasis: string

  /**********
   *
   **********/
  @Column({
    type: DataType.ARRAY(DataType.ENUM),
    allowNull: true,
    values: Object.values(CaseCustodyProvisions),
  })
  @ApiProperty({ enum: CaseCustodyProvisions, isArray: true })
  custodyProvisions: CaseCustodyProvisions[]

  /**********
   *
   **********/
  @Column({
    type: DataType.ARRAY(DataType.ENUM),
    allowNull: true,
    values: Object.values(CaseCustodyRestrictions),
  })
  @ApiProperty({ enum: CaseCustodyRestrictions, isArray: true })
  requestedCustodyRestrictions: CaseCustodyRestrictions[]

  /**********
   *
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  requestedOtherRestrictions: string

  /**********
   *
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  caseFacts: string

  /**********
   *
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  legalArguments: string

  /**********
   *
   **********/
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiProperty()
  requestProsecutorOnlySession: boolean

  /**********
   *
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  prosecutorOnlySessionRequest: string

  /**********
   *
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  comments: string

  /**********
   *
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  caseFilesComments: string

  @ForeignKey(() => User)
  /**********
   *
   **********/
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiProperty()
  prosecutorId: string

  @BelongsTo(() => User, 'prosecutorId')
  @ApiProperty({ type: User })
  prosecutor: User

  @ForeignKey(() => Institution)
  /**********
   *
   **********/
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiProperty()
  sharedWithProsecutorsOfficeId: string

  @BelongsTo(() => Institution, 'sharedWithProsecutorsOfficeId')
  @ApiProperty({ type: Institution })
  sharedWithProsecutorsOffice: Institution

  /**********
   *
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  courtCaseNumber: string

  /**********
   *
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  courtDate: Date

  /**********
   *
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  courtRoom: string

  /**********
   *
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  courtStartDate: Date

  /**********
   *
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  courtEndTime: Date

  /**********
   *
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  courtAttendees: string

  /**********
   *
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  prosecutorDemands: string

  /**********
   *
   **********/
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  @ApiProperty()
  courtDocuments: string[]

  /**********
   *
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  additionToConclusion: string

  /**********
   *
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(AccusedPleaDecision),
  })
  @ApiProperty({ enum: AccusedPleaDecision })
  accusedPleaDecision: AccusedPleaDecision

  /**********
   *
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  accusedPleaAnnouncement: string

  /**********
   *
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  litigationPresentations: string

  /**********
   *
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  courtCaseFacts: string

  /**********
   *
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  courtLegalArguments: string

  /**********
   *
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  ruling: string

  /**********
   *
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CaseDecision),
  })
  @ApiProperty({ enum: CaseDecision })
  decision: CaseDecision

  /**********
   *
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  validToDate: Date

  /**********
   *
   **********/
  @Column({
    type: DataType.ARRAY(DataType.ENUM),
    allowNull: true,
    values: Object.values(CaseCustodyRestrictions),
  })
  @ApiProperty({ enum: CaseCustodyRestrictions, isArray: true })
  custodyRestrictions: CaseCustodyRestrictions[]

  /**********
   *
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  otherRestrictions: string

  /**********
   *
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  isolationTo: Date

  /**********
   *
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CaseAppealDecision),
  })
  @ApiProperty({ enum: CaseAppealDecision })
  accusedAppealDecision: CaseAppealDecision

  /**********
   *
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  accusedAppealAnnouncement: string

  /**********
   *
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CaseAppealDecision),
  })
  @ApiProperty({ enum: CaseAppealDecision })
  prosecutorAppealDecision: CaseAppealDecision

  /**********
   *
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  prosecutorAppealAnnouncement: string

  /**********
   *
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  accusedPostponedAppealDate: Date

  /**********
   *
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  prosecutorPostponedAppealDate: Date

  /**********
   *
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  rulingDate: Date

  /**********
   *
   **********/
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiProperty()
  registrarId: string

  @BelongsTo(() => User, 'registrarId')
  @ApiProperty({ type: User })
  registrar: User

  /**********
   *
   **********/
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiProperty()
  judgeId: string

  @BelongsTo(() => User, 'judgeId')
  @ApiProperty({ type: User })
  judge: User

  /**********
   *
   **********/
  @ForeignKey(() => Case)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiProperty()
  parentCaseId: string

  @BelongsTo(() => Case, 'parentCaseId')
  @ApiProperty({ type: Case })
  parentCase: Case

  @HasOne(() => Case, 'parentCaseId')
  @ApiProperty({ type: Case })
  childCase: Case
}
