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

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import type {
  CrimeSceneMap,
  IndictmentSubtypeMap,
} from '@island.is/judicial-system/types'
import {
  CaseAppealDecision,
  CaseAppealRulingDecision,
  CaseAppealState,
  CaseCustodyRestrictions,
  CaseDecision,
  CaseLegalProvisions,
  CaseOrigin,
  CaseState,
  CaseType,
  CourtDocument,
  RequestSharedWithDefender,
  SessionArrangements,
} from '@island.is/judicial-system/types'

import { Defendant } from '../../defendant'
import { EventLog } from '../../event-log'
import { CaseFile } from '../../file'
import { IndictmentCount } from '../../indictment-count'
import { Institution } from '../../institution'
import { User } from '../../user'

@Table({
  tableName: 'case',
  timestamps: true,
})
export class Case extends Model {
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
   * The date and time the case was created in the Database
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
   * The case origin - example: RVG
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(CaseOrigin),
  })
  @ApiProperty({ enum: CaseOrigin })
  origin!: CaseOrigin

  /**********
   * The case type - example: CUSTODY
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(CaseType),
  })
  @ApiProperty({ enum: CaseType })
  type!: CaseType

  /**********
   * The case subtype it type is INDICTMENT - example: MINOR_ASSAULT
   **********/
  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  @ApiPropertyOptional()
  indictmentSubtypes?: IndictmentSubtypeMap

  /**********
   * A further description of the case type - optional
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
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
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  @ApiProperty()
  policeCaseNumbers!: string[]

  /**********
   * The case's defendants
   **********/
  @HasMany(() => Defendant, 'caseId')
  @ApiPropertyOptional({ type: () => Defendant, isArray: true })
  defendants?: Defendant[]

  /**********
   * The name of the accused's defender - optional
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  defenderName?: string

  /**********
   * The national of the accused's defender - optional
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  defenderNationalId?: string

  /**********
   * The email address of the accused's defender - optional
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  defenderEmail?: string

  /**********
   * The phone number of the accused's defender - optional
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  defenderPhoneNumber?: string

  /**********
   * Indicates whether, and if so when, the prosecutor's request should become accessible to the accused's
   * defender - optional
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(RequestSharedWithDefender),
  })
  @ApiPropertyOptional({ enum: RequestSharedWithDefender })
  requestSharedWithDefender?: RequestSharedWithDefender

  /**********
   * Indicates whether the secutity level of the case has been heightened -
   * optional
   **********/
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiPropertyOptional()
  isHeightenedSecurityLevel?: boolean

  /**********
   * The surrogate key of the court assigned to the case
   **********/
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiPropertyOptional()
  courtId?: string

  /**********
   * The court assigned to the case
   **********/
  @BelongsTo(() => Institution, 'courtId')
  @ApiPropertyOptional({ type: () => Institution })
  court?: Institution

  /**********
   * The lead investigator assigned to the case - usually name and title -
   * optional for most case types
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  leadInvestigator?: string

  /**********
   * The date and time the accused was arrested - optional
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  arrestDate?: Date

  /**********
   * The prosecutor's requested court date and time
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  requestedCourtDate?: Date

  /**********
   * The translator assigned to the case
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  translator?: string

  /**********
   * The prosecutor's requested ruling expiration date and time - example: the end of custody
   * in custody cases - optional for some case types
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  requestedValidToDate?: Date

  /**********
   * The prosecutor's demands - in some cases they are auto generated from the requested ruling
   * expiration date - can be modified even when auto generated
   **********/
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  demands?: string

  /**********
   * The laws broken by the accused
   **********/
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  lawsBroken?: string

  /**********
   * The laws on which the demands are based. Used as additional legal
   * provisions in custody and travel ban cases.
   **********/
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  legalBasis?: string

  /**********
   * The laws on which the demands are based - from a predetermined list - example: _95_1_A -
   * only used for custody and travel ban cases
   **********/
  @Column({
    type: DataType.ARRAY(DataType.ENUM),
    allowNull: true,
    values: Object.values(CaseLegalProvisions),
  })
  @ApiPropertyOptional({ enum: CaseLegalProvisions, isArray: true })
  legalProvisions?: CaseLegalProvisions[]

  /**********
   * Restrictions requested by the prosecutor - from a predetermined list - example: ISOLATION -
   * only used for custody and travel ban cases - optional
   **********/
  @Column({
    type: DataType.ARRAY(DataType.ENUM),
    allowNull: true,
    values: Object.values(CaseCustodyRestrictions),
  })
  @ApiPropertyOptional({ enum: CaseCustodyRestrictions, isArray: true })
  requestedCustodyRestrictions?: CaseCustodyRestrictions[]

  /**********
   * Additional restrictions requested by the prosecutor - only used for travel ban cases -
   * optional
   **********/
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  requestedOtherRestrictions?: string

  /**********
   * The facts of the case as seen by the prosecutor
   **********/
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  caseFacts?: string

  /**********
   * The prosecutor's legal arguments
   **********/
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  legalArguments?: string

  /**********
   * Indicates whether the prosecutor is requesting a court session in which the counter party
   * is not represented - not used for custody and travel ban cases - optional
   **********/
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiPropertyOptional()
  requestProsecutorOnlySession?: boolean

  /**********
   * The prosecutor's request for a court session in which the counter party is not represented -
   * not used for custody and travel ban cases - optional
   **********/
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  prosecutorOnlySessionRequest?: string

  /**********
   * Comments from the prosecutor to the court - optional
   **********/
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  comments?: string

  /**********
   * Comments from the prosecutor to the court regarding the accompanying case files - optional
   **********/
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  caseFilesComments?: string

  /**********
   * The surrogate key of the prosecutor that created the case
   **********/
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiPropertyOptional()
  creatingProsecutorId?: string

  /**********
   * The prosecutor that created the case
   **********/
  @BelongsTo(() => User, 'creatingProsecutorId')
  @ApiPropertyOptional({ type: () => User })
  creatingProsecutor?: User

  /**********
   * The surrogate key of the prosecutor assigned to the case
   **********/
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiPropertyOptional()
  prosecutorId?: string

  /**********
   * The prosecutor assigned to the case
   **********/
  @BelongsTo(() => User, 'prosecutorId')
  @ApiPropertyOptional({ type: () => User })
  prosecutor?: User

  /**********
   * The surrogate key of the prosecutor's office the case has been shared with - optional
   **********/
  @ForeignKey(() => Institution)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiPropertyOptional()
  sharedWithProsecutorsOfficeId?: string

  /**********
   * The prosecutor's office the case has been shared with - optional
   **********/
  @BelongsTo(() => Institution, 'sharedWithProsecutorsOfficeId')
  @ApiPropertyOptional({ type: () => Institution })
  sharedWithProsecutorsOffice?: Institution

  /**********
   * The case number assigned in Auður (court information system)
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  courtCaseNumber?: string

  /**********
   * The session arrangements - example: ALL_PRESENT
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(SessionArrangements),
  })
  @ApiPropertyOptional({ enum: SessionArrangements })
  sessionArrangements?: SessionArrangements

  /**********
   * The scheduled date and time of the case's court session
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  courtDate?: Date

  /**********
   * The location of the court session
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  courtLocation?: string

  /**********
   * The assigned court room for the court session
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  courtRoom?: string

  /**********
   * The date and time the court session started
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  courtStartDate?: Date

  /**********
   * The date and time the court session ended
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  courtEndTime?: Date

  /**********
   * Indicates whether the closed court announcement is hidden from the court record - optional
   **********/
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiPropertyOptional()
  isClosedCourtHidden?: boolean

  /**********
   * The court attendees
   **********/
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  courtAttendees?: string

  /**********
   * The prosecutor's demands - autofilled from demands - possibly modified by the court
   **********/
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  prosecutorDemands?: string

  /**********
   * A list of additional court documents - optional
   **********/
  @Column({
    type: DataType.ARRAY(DataType.JSON),
    allowNull: true,
  })
  @ApiPropertyOptional()
  courtDocuments?: CourtDocument[]

  /**********
   * Bookings during court session
   **********/
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  sessionBookings?: string

  /**********
   * The case facts as seen by the prosecutor - autofilled from caseFacts - possibly modified
   * by the court
   **********/
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  courtCaseFacts?: string

  /**********
   * Introduction to the case
   **********/
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  introduction?: string

  /**********
   * The legal arguments presented by the prosecutor - autofilled from legalArguments -
   * possibly modified by the court
   **********/
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  courtLegalArguments?: string

  /**********
   * The judge's ruling
   **********/
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  ruling?: string

  /**********
   * The judge's pending decision - example: ACCEPTING
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CaseDecision),
  })
  @ApiPropertyOptional({ enum: CaseDecision })
  decision?: CaseDecision

  /**********
   * The ruling expiration date and time - example: the end of custody in custody cases -
   * autofilled from requestedValidToDate - possibly modified by the court - only used for
   * custody, admission to facility and travel ban cases
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  validToDate?: Date

  /**********
   * Indicates whether the judge imposes isolation - prefilled from
   * requestedCustodyRestrictions - only used for custody and admission to facility cases
   **********/
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiPropertyOptional()
  isCustodyIsolation?: boolean

  /**********
   * Expiration date and time for isolation - prefilled from requestedValidToDate - only used
   * for custody and admission to facility cases and only relevant if the judge imposes isolation
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  isolationToDate?: Date

  /**********
   * The case conclusion
   **********/
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  conclusion?: string

  /**********
   * Bookings at the end of the court session - prefilled from requestedCustodyRestrictions
   * in custody and travel ban cases - optional
   **********/
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  endOfSessionBookings?: string

  /**********
   * The accused's appeal decision - example: APPEAL
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CaseAppealDecision),
  })
  @ApiPropertyOptional({ enum: CaseAppealDecision })
  accusedAppealDecision?: CaseAppealDecision

  /**********
   * The accused's appeal announcement - only used if the accused appeals in court
   **********/
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  accusedAppealAnnouncement?: string

  /**********
   * The prosecutor's appeal decision - example: POSTPONE
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CaseAppealDecision),
  })
  @ApiPropertyOptional({ enum: CaseAppealDecision })
  prosecutorAppealDecision?: CaseAppealDecision

  /**********
   * The prosecutor's appeal announcement - only used if the prosecutor appeals in court
   **********/
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  prosecutorAppealAnnouncement?: string

  /**********
   * The date and time of the accused's postponed appeal - only used if the accused postponed
   * her appeal decision and later appealed within the allowed time frame
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  accusedPostponedAppealDate?: Date

  /**********
   * The date and time of the prosecutor's postponed appeal - only used if the prosecutor
   * postponed his appeal decision and later appealed within the allowed time frame
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  prosecutorPostponedAppealDate?: Date

  /**********
   * The date and time of the judge's ruling (when the csae is completed)
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  rulingDate?: Date

  /**********
   * The date and time of the judge's ruling signature
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  rulingSignatureDate?: Date

  /**********
   * The date and time of the judge's inital ruling signature - used for extended cases
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  initialRulingDate?: Date

  /**********
   * The surrogate key of the registrar assigned to the case
   **********/
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiPropertyOptional()
  registrarId?: string

  /**********
   * The registrar assigned to the case
   **********/
  @BelongsTo(() => User, 'registrarId')
  @ApiPropertyOptional({ type: () => User })
  registrar?: User

  /**********
   * The surrogate key of the judge assigned to the case
   **********/
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiPropertyOptional()
  judgeId?: string

  /**********
   * The judge assigned to the case
   **********/
  @BelongsTo(() => User, 'judgeId')
  @ApiPropertyOptional({ type: () => User })
  judge?: User

  /**********
   * The surrogate key of the user that signed the court record of the case
   **********/
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiPropertyOptional()
  courtRecordSignatoryId?: string

  /**********
   * The user that signed the court record of the case
   **********/
  @BelongsTo(() => User, 'courtRecordSignatoryId')
  @ApiPropertyOptional({ type: () => User })
  courtRecordSignatory?: User

  /**********
   * The court record signature date
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  courtRecordSignatureDate?: Date

  /**********
   * The surrogate key of the case's parent case - only used if the case is an extension
   **********/
  @ForeignKey(() => Case)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiPropertyOptional()
  parentCaseId?: string

  /**********
   * The case's parent case - only used if the case is an extension
   **********/
  @BelongsTo(() => Case, 'parentCaseId')
  @ApiPropertyOptional({ type: () => Case })
  parentCase?: Case

  /**********
   * The case's child case - only used if the case has been extended
   **********/
  @HasOne(() => Case, 'parentCaseId')
  @ApiPropertyOptional({ type: () => Case })
  childCase?: Case

  /**********
   * The case's files
   **********/
  @HasMany(() => CaseFile, 'caseId')
  @ApiPropertyOptional({ type: () => CaseFile, isArray: true })
  caseFiles?: CaseFile[]

  /**********
   * The explanation given for a modification of a case's validTo or isolationTo dates
   **********/
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  caseModifiedExplanation?: string

  /**********
   * The history on when a case's ruling was modified
   **********/
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  rulingModifiedHistory?: string

  /**********
   * The explanation given for the extension of a case
   **********/
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  caseResentExplanation?: string

  /**********
   * Indicates whether the case has been archived - optional
   **********/
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiPropertyOptional()
  isArchived?: boolean

  /**********
   * The date and time of when the defender in a case opened the case
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  openedByDefender?: Date

  /**********
   * Indicates whether the defendant waives her right to counsel
   **********/
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  defendantWaivesRightToCounsel!: boolean

  /**********
   * The crime scenes of the case
   **********/
  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  @ApiPropertyOptional()
  crimeScenes?: CrimeSceneMap

  /**********
   * The introduction to a traffic violation case
   **********/
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  indictmentIntroduction?: string

  /**********
   * The case's counts - only used if the case is an indictment
   **********/
  @HasMany(() => IndictmentCount, 'caseId')
  @ApiPropertyOptional({ type: () => IndictmentCount, isArray: true })
  indictmentCounts?: IndictmentCount[]

  /**********
   * Indicates whether the prosecutor requests a drivers license suspension
   **********/
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiProperty()
  requestDriversLicenseSuspension?: boolean

  /**********
   * The case appeal state
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CaseAppealState),
  })
  @ApiProperty({ enum: CaseAppealState })
  appealState?: CaseAppealState

  /**********
   * The date and time when the prosecutor appeal statement was sent
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  prosecutorStatementDate?: Date

  /**********
   * The date and time when the defendant appeal statement was sent
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  defendantStatementDate?: Date

  /**********
   * The time and date that the court marked an appeal as received
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  appealReceivedByCourtDate?: Date

  /**********
   * The appeal conclusion
   **********/
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  appealConclusion?: string

  /**********
   * The case appeal ruling decision
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CaseAppealRulingDecision),
  })
  @ApiProperty({ enum: CaseAppealRulingDecision })
  appealRulingDecision?: CaseAppealRulingDecision

  /**********
   * The appeal case number assigned in the court of appeals
   **********/
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  appealCaseNumber?: string

  /**********
   * The surrogate key of the assistant assigned to the appeal case
   **********/
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiPropertyOptional()
  appealAssistantId?: string

  /**********
   * The assistant assigned to the appeal case
   **********/
  @BelongsTo(() => User, 'appealAssistantId')
  @ApiPropertyOptional({ type: User })
  appealAssistant?: User

  /**********
   * The surrogate key of the first judge assigned to the appeal case
   **********/
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiPropertyOptional()
  appealJudge1Id?: string

  /**********
   * The first judge assigned to the appeal case
   **********/
  @BelongsTo(() => User, 'appealJudge1Id')
  @ApiPropertyOptional({ type: User })
  appealJudge1?: User

  /**********
   * The surrogate key of the second judge assigned to the appeal case
   **********/
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiPropertyOptional()
  appealJudge2Id?: string

  /**********
   * The second judge assigned to the appeal case
   **********/
  @BelongsTo(() => User, 'appealJudge2Id')
  @ApiPropertyOptional({ type: User })
  appealJudge2?: User

  /**********
   * The surrogate key of the third judge assigned to the appeal case
   **********/
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiPropertyOptional()
  appealJudge3Id?: string

  /**********
   * The third judge assigned to the appeal case
   **********/
  @BelongsTo(() => User, 'appealJudge3Id')
  @ApiPropertyOptional({ type: User })
  appealJudge3?: User

  /**********
   * The history on when a case's appeal ruling was modified
   **********/
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  appealRulingModifiedHistory?: string

  /**********
   * The case's event logs
   **********/
  @HasMany(() => EventLog, 'caseId')
  @ApiPropertyOptional({ type: EventLog, isArray: true })
  eventLogs?: EventLog[]

  /**********
   * The appeal ruling expiration date and time - example: the end of custody in custody cases -
   * autofilled from validToDate - possibly modified by the court of appeals - only used for
   * custody, admission to facility and travel ban cases
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  appealValidToDate?: Date

  /**********
   * Indicates whether the judge imposes isolation - prefilled from
   * isCustodyIsolation - only used for custody and admission to facility cases
   **********/
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiPropertyOptional()
  isAppealCustodyIsolation?: boolean

  /**********
   * Expiration date and time for isolation - prefilled from isolationToDate - only used
   * for custody and admission to facility cases and only relevant if the judge imposes isolation
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  appealIsolationToDate?: Date
}
