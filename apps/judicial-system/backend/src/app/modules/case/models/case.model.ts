import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
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
  SessionArrangements,
} from '@island.is/judicial-system/types'

import { CaseFile } from '../../file/models/file.model'
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
  id!: string

  /**********
   * The date and time the case was created in the database
   **********/
  @CreatedAt
  @ApiProperty()
  created!: Date

  /**********
   * The date and time the case was last updated in the database
   **********/
  @UpdatedAt
  @ApiProperty()
  modified!: Date

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
   * A further description of the case type - optional
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  description?: string

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
   * A case number in LÖKE (police information system) connected to the case
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  policeCaseNumber!: string

  /**********
   * The national id of the accused
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  accusedNationalId!: string

  /**********
   * The name of the accused
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  accusedName?: string

  /**********
   * The address of the accused
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  accusedAddress?: string

  /**********
   * The gender of the accused
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CaseGender),
  })
  accusedGender?: CaseGender

  /**********
   * The name of the accused's defender - optional
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  defenderName?: string

  /**********
   * The email address of the accused's defender - optional
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  defenderEmail?: string

  /**********
   * The phone number of the accused's defender - optional
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  defenderPhoneNumber?: string

  /**********
   * Indicates whether the prosecutor's request should be sent to the accused's defender
   * when a court date has been assigned to the case - optional
   **********/
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiProperty()
  sendRequestToDefender?: boolean

  /**********
   * Indicates whether the accused was assigned a spokesperson rather than a defender -
   * optional
   **********/
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiProperty()
  defenderIsSpokesperson?: boolean

  /**********
   * The surrogate key of the court assigned to the case
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  courtId?: string

  /**********
   * The court assigned to the case
   **********/
  @BelongsTo(() => Institution, 'courtId')
  @ApiProperty({ type: Institution })
  court?: Institution

  /**********
   * The lead investigator assigned to the case - usually name and title -
   * optional for most case types
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  leadInvestigator?: string

  /**********
   * The date and time the accused was arrested - optional
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  arrestDate?: Date

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
   * The prosecutor's requested ruling expiration date and time - example: the end of custody
   * in custody cases - optional for some case types
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  requestedValidToDate?: Date

  /**********
   * The prosecutor's demands - in some cases they are auto generated from the requested ruling
   * expiration date - can be modified even when auto generated
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  demands?: string

  /**********
   * The laws broken by the accused
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  lawsBroken?: string

  /**********
   * The laws on which the demands are based - not used for custody and travel ban cases
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  legalBasis?: string

  /**********
   * The laws on which the demands are based - from a predetermined list - example: _95_1_A -
   * only used for custody and travel ban cases
   **********/
  @Column({
    type: DataType.ARRAY(DataType.ENUM),
    allowNull: true,
    values: Object.values(CaseCustodyProvisions),
  })
  @ApiProperty({ enum: CaseCustodyProvisions, isArray: true })
  custodyProvisions?: CaseCustodyProvisions[]

  /**********
   * Restrictions requested by the prosecutor - from a predetermined list - example: ISOLATION -
   * only used for custody and travel ban cases - optional
   **********/
  @Column({
    type: DataType.ARRAY(DataType.ENUM),
    allowNull: true,
    values: Object.values(CaseCustodyRestrictions),
  })
  @ApiProperty({ enum: CaseCustodyRestrictions, isArray: true })
  requestedCustodyRestrictions?: CaseCustodyRestrictions[]

  /**********
   * Additional restrictions requested by the prosecutor - only used for travel ban cases -
   * optional
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  requestedOtherRestrictions?: string

  /**********
   * The facts of the case as seen by the prosecutor
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  caseFacts?: string

  /**********
   * The prosecutor's legal arguments
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  legalArguments?: string

  /**********
   * Indicates whether the prosecutor is requesting a court session in which the counter party
   * is not represented - not used for custody and travel ban cases - optional
   **********/
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiProperty()
  requestProsecutorOnlySession?: boolean

  /**********
   * The prosecutor's request for a court session in which the counter party is not represented -
   * not used for custody and travel ban cases - optional
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  prosecutorOnlySessionRequest?: string

  /**********
   * Comments from the prosecutor to the court - optional
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  comments?: string

  /**********
   * Comments from the prosecutor to the court regarding the accompanying case files - optional
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  caseFilesComments?: string

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
   * The surrogate key of the prosecutor's office the case has been shared with - optional
   **********/
  @ForeignKey(() => Institution)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiProperty()
  sharedWithProsecutorsOfficeId?: string

  /**********
   * The prosecutor's office the case has been shared with - optional
   **********/
  @BelongsTo(() => Institution, 'sharedWithProsecutorsOfficeId')
  @ApiProperty({ type: Institution })
  sharedWithProsecutorsOffice?: Institution

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
   * The session arrangements - example: ALL_PRESENT
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(SessionArrangements),
  })
  @ApiProperty({ enum: SessionArrangements })
  sessionArrangements?: SessionArrangements

  /**********
   * The scheduled date and time of the case's court session
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  courtDate?: Date

  /**********
   * The assigned court room for the court session
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  courtRoom?: string

  /**********
   * The date and time the court session started
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  courtStartDate?: Date

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
   * The court attendees
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  courtAttendees?: string

  /**********
   * The prosecutor's demands - autofilled from demands - possibly modified by the court
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  prosecutorDemands?: string

  /**********
   * A list of additional court documents - optional
   **********/
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  @ApiProperty()
  courtDocuments?: string[]

  /**********
   * Indicates whether the accused was present during the court session - optional
   **********/
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiProperty()
  isAccusedAbsent?: boolean

  /**********
   * The accused's plea decision - example: REJECT
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(AccusedPleaDecision),
  })
  @ApiProperty({ enum: AccusedPleaDecision })
  accusedPleaDecision?: AccusedPleaDecision

  /**********
   * The accused's plea
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  accusedPleaAnnouncement?: string

  /**********
   * The presentations for both parties
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  litigationPresentations?: string

  /**********
   * The case facts as seen by the prosecutor - autofilled from caseFacts - possibly modified
   * by the court
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  courtCaseFacts?: string

  /**********
   * The legal arguments presented by the prosecutor - autofilled from legalArguments -
   * possibly modified by the court
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  courtLegalArguments?: string

  /**********
   * The judge's ruling
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  ruling?: string

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
   * Restrictions imposed by the judge - from a predetermined list - example: ISOLATION -
   * only used for custody and travel ban cases - optional
   **********/
  @Column({
    type: DataType.ARRAY(DataType.ENUM),
    allowNull: true,
    values: Object.values(CaseCustodyRestrictions),
  })
  @ApiProperty({ enum: CaseCustodyRestrictions, isArray: true })
  custodyRestrictions?: CaseCustodyRestrictions[]

  /**********
   * Additional restrictions imposed by the judge - prefilled from requestedOtherRestrictions -
   * only used for travel ban cases - optional
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  otherRestrictions?: string

  /**********
   * Expiration date and time for isolation - prefilled from requestedValidToDate - only used
   * for custody cases and only relevant if the judge imposes isolation
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  isolationToDate?: Date

  /**********
   * The case conclusion - optional for custody and travel ban cases as the core conclusions
   * are auto generated
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  conclusion?: string

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
   * The accused's appeal announcement - only used if the accused appeals in court
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  accusedAppealAnnouncement?: string

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
   * The prosecutor's appeal announcement - only used if the prosecutor appeals in court
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  prosecutorAppealAnnouncement?: string

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
   * The date and time of the judge's ruling signature
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  rulingDate?: Date

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

  /**********
   * The case's child case - only used if the case has been extended
   **********/
  @HasOne(() => Case, 'parentCaseId')
  @ApiProperty({ type: Case })
  childCase?: Case

  /**********
   * The case's files
   **********/
  @HasMany(() => CaseFile, 'caseId')
  @ApiProperty({ type: CaseFile, isArray: true })
  caseFiles?: CaseFile[]
}
