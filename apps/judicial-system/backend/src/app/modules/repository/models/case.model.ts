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
  CaseIndictmentRulingDecision,
  CaseLegalProvisions,
  CaseOrigin,
  CaseState,
  CaseType,
  CourtDocument as TCourtDocument,
  CourtSessionType,
  IndictmentCaseReviewDecision,
  IndictmentDecision,
  RequestSharedWithDefender,
  SessionArrangements,
  UserRole,
} from '@island.is/judicial-system/types'

import { CaseFile } from './caseFile.model'
import { CaseString } from './caseString.model'
import { CivilClaimant } from './civilClaimant.model'
import { CourtDocument } from './courtDocument.model'
import { CourtSession } from './courtSession.model'
import { DateLog } from './dateLog.model'
import { Defendant } from './defendant.model'
import { EventLog } from './eventLog.model'
import { IndictmentCount } from './indictmentCount.model'
import { Institution } from './institution.model'
import { Notification } from './notification.model'
import { User } from './user.model'
import { Victim } from './victim.model'

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
  @ApiProperty({ type: String })
  id!: string

  /**********
   * The date and time the case was created in the Database
   **********/
  @CreatedAt
  @ApiProperty({ type: Date })
  created!: Date

  /**********
   * The date and time the case was last updated in the database
   **********/
  @UpdatedAt
  @ApiProperty({ type: Date })
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
  @Column({ type: DataType.JSON, allowNull: true })
  @ApiPropertyOptional({ type: Object })
  indictmentSubtypes?: IndictmentSubtypeMap

  /**********
   * A further description of the case type - optional
   **********/
  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
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
  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false })
  @ApiProperty({ type: String, isArray: true })
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
  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  defenderName?: string

  /**********
   * The national of the accused's defender - optional
   **********/
  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  defenderNationalId?: string

  /**********
   * The email address of the accused's defender - optional
   **********/
  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  defenderEmail?: string

  /**********
   * The phone number of the accused's defender - optional
   **********/
  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
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
   * Indicates whether the security level of the case has been heightened -
   * optional
   **********/
  @Column({ type: DataType.BOOLEAN, allowNull: true })
  @ApiPropertyOptional({ type: Boolean })
  isHeightenedSecurityLevel?: boolean

  /**********
   * The surrogate key of the court assigned to the case
   **********/
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
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
  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  leadInvestigator?: string

  /**********
   * The date and time the accused was arrested - optional
   **********/
  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  arrestDate?: Date

  /**********
   * The prosecutor's requested court date and time
   **********/
  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  requestedCourtDate?: Date

  /**********
   * The translator assigned to the case
   **********/
  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  translator?: string

  /**********
   * The prosecutor's requested ruling expiration date and time - example: the end of custody
   * in custody cases - optional for some case types
   **********/
  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  requestedValidToDate?: Date

  /**********
   * The prosecutor's demands - in some cases they are auto generated from the requested ruling
   * expiration date - can be modified even when auto generated
   **********/
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  demands?: string

  /**********
   * The laws broken by the accused
   **********/
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  lawsBroken?: string

  /**********
   * The laws on which the demands are based. Used as additional legal
   * provisions in custody and travel ban cases.
   **********/
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
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
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  requestedOtherRestrictions?: string

  /**********
   * The facts of the case as seen by the prosecutor
   **********/
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  caseFacts?: string

  /**********
   * The prosecutor's legal arguments
   **********/
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  legalArguments?: string

  /**********
   * Indicates whether the prosecutor is requesting a court session in which the counter party
   * is not represented - not used for custody and travel ban cases - optional
   **********/
  @Column({ type: DataType.BOOLEAN, allowNull: true })
  @ApiPropertyOptional({ type: Boolean })
  requestProsecutorOnlySession?: boolean

  /**********
   * The prosecutor's request for a court session in which the counter party is not represented -
   * not used for custody and travel ban cases - optional
   **********/
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  prosecutorOnlySessionRequest?: string

  /**********
   * Comments from the prosecutor to the court - optional
   **********/
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  comments?: string

  /**********
   * Comments from the prosecutor to the court regarding the accompanying case files - optional
   **********/
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  caseFilesComments?: string

  /**********
   * The surrogate key of the prosecutor that created the case
   **********/
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
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
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
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
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
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
  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
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
   * The location of the court session
   **********/
  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  courtLocation?: string

  /**********
   * The date and time the court session started
   **********/
  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  courtStartDate?: Date

  /**********
   * The date and time the court session ended
   **********/
  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  courtEndTime?: Date

  /**********
   * Indicates whether the closed court announcement is hidden from the court record - optional
   **********/
  @Column({ type: DataType.BOOLEAN, allowNull: true })
  @ApiPropertyOptional({ type: Boolean })
  isClosedCourtHidden?: boolean

  /**********
   * The court attendees
   **********/
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  courtAttendees?: string

  /**********
   * The prosecutor's demands - autofilled from demands - possibly modified by the court
   **********/
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  prosecutorDemands?: string

  /**********
   * A list of additional court documents - optional
   **********/
  @Column({ type: DataType.ARRAY(DataType.JSON), allowNull: true })
  @ApiPropertyOptional({ type: Object, isArray: true })
  courtDocuments?: TCourtDocument[]

  /**********
   * Bookings during court session
   **********/
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  sessionBookings?: string

  /**********
   * The case facts as seen by the prosecutor - autofilled from caseFacts - possibly modified
   * by the court
   **********/
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  courtCaseFacts?: string

  /**********
   * Introduction to the case
   **********/
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  introduction?: string

  /**********
   * The legal arguments presented by the prosecutor - autofilled from legalArguments -
   * possibly modified by the court
   **********/
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  courtLegalArguments?: string

  /**********
   * The judge's ruling
   **********/
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
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
  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  validToDate?: Date

  /**********
   * Indicates whether the judge imposes isolation - prefilled from
   * requestedCustodyRestrictions - only used for custody and admission to facility cases
   **********/
  @Column({ type: DataType.BOOLEAN, allowNull: true })
  @ApiPropertyOptional({ type: Boolean })
  isCustodyIsolation?: boolean

  /**********
   * Expiration date and time for isolation - prefilled from requestedValidToDate - only used
   * for custody and admission to facility cases and only relevant if the judge imposes isolation
   **********/
  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  isolationToDate?: Date

  /**********
   * The case conclusion
   **********/
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  conclusion?: string

  /**********
   * Bookings at the end of the court session - prefilled from requestedCustodyRestrictions
   * in custody and travel ban cases - optional
   **********/
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
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
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
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
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  prosecutorAppealAnnouncement?: string

  /**********
   * The date and time of the accused's postponed appeal - only used if the accused postponed
   * her appeal decision and later appealed within the allowed time frame
   **********/
  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  accusedPostponedAppealDate?: Date

  /**********
   * The date and time of the prosecutor's postponed appeal - only used if the prosecutor
   * postponed his appeal decision and later appealed within the allowed time frame
   **********/
  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  prosecutorPostponedAppealDate?: Date

  /**********
   * The date and time of the judge's ruling (when the case is completed)
   **********/
  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  rulingDate?: Date

  /**********
   * The date and time of the judge's ruling signature
   **********/
  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  rulingSignatureDate?: Date

  /**********
   * The date and time of the judge's inital ruling signature - used for extended cases
   **********/
  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  initialRulingDate?: Date

  /**********
   * The surrogate key of the registrar assigned to the case
   **********/
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
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
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
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
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
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
  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  courtRecordSignatureDate?: Date

  /**********
   * The surrogate key of the case's parent case - only used if the case is an extension
   **********/
  @ForeignKey(() => Case)
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
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
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  caseModifiedExplanation?: string

  /**********
   * The history on when a case's ruling was modified
   **********/
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  rulingModifiedHistory?: string

  /**********
   * The explanation given for the extension of a case
   **********/
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  caseResentExplanation?: string

  /**********
   * Indicates whether the case has been archived - optional
   **********/
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  @ApiPropertyOptional({ type: Boolean })
  isArchived?: boolean

  /**********
   * The date and time of when the defender in a case opened the case
   **********/
  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  openedByDefender?: Date

  /**********
   * Indicates whether the defendant waives her right to counsel
   **********/
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  @ApiProperty({ type: Boolean })
  defendantWaivesRightToCounsel!: boolean

  /**********
   * The crime scenes of the case
   **********/
  @Column({ type: DataType.JSON, allowNull: true })
  @ApiPropertyOptional({ type: Object })
  crimeScenes?: CrimeSceneMap

  /**********
   * The introduction to a indictment case
   **********/
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  indictmentIntroduction?: string

  /**********
   * The case's counts - only used if the case is an indictment
   **********/
  @HasMany(() => IndictmentCount, 'caseId')
  @ApiPropertyOptional({ type: () => IndictmentCount, isArray: true })
  indictmentCounts?: IndictmentCount[]

  /**********
   * Indicates whether the indictment case should have court sessions
   ***********/
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  @ApiPropertyOptional({ type: Boolean })
  withCourtSessions!: boolean

  /**********
   * The case's court sessions
   **********/
  @HasMany(() => CourtSession, 'caseId')
  @ApiPropertyOptional({ type: () => CourtSession, isArray: true })
  courtSessions?: CourtSession[]

  /**********
   * The case's unfiled court documents
   **********/
  @HasMany(() => CourtDocument, 'caseId')
  @ApiPropertyOptional({ type: () => CourtDocument, isArray: true })
  unfiledCourtDocuments?: CourtDocument[]

  /**********
   * Indicates whether the prosecutor requests a drivers license suspension
   **********/
  @Column({ type: DataType.BOOLEAN, allowNull: true })
  @ApiProperty({ type: Boolean })
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
  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  prosecutorStatementDate?: Date

  /**********
   * The date and time when the defendant appeal statement was sent
   **********/
  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  defendantStatementDate?: Date

  /**********
   * The time and date that the court marked an appeal as received
   **********/
  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  appealReceivedByCourtDate?: Date

  /**********
   * The appeal conclusion
   **********/
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
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
  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  appealCaseNumber?: string

  /**********
   * The surrogate key of the assistant assigned to the appeal case
   **********/
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
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
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
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
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
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
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
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
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  appealRulingModifiedHistory?: string

  /**********
   * The case's event logs
   **********/
  @HasMany(() => EventLog, 'caseId')
  @ApiPropertyOptional({ type: EventLog, isArray: true })
  eventLogs?: EventLog[]

  /**********
   * The case's date logs
   **********/
  @HasMany(() => DateLog, 'caseId')
  @ApiPropertyOptional({ type: DateLog, isArray: true })
  dateLogs?: DateLog[]

  /**********
   * The case's strings
   **********/
  @HasMany(() => CaseString, 'caseId')
  @ApiPropertyOptional({ type: CaseString, isArray: true })
  caseStrings?: CaseString[]

  /**********
   * The appeal ruling expiration date and time - example: the end of custody in custody cases -
   * autofilled from validToDate - possibly modified by the court of appeals - only used for
   * custody, admission to facility and travel ban cases
   **********/
  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  appealValidToDate?: Date

  /**********
   * Indicates whether the judge imposes isolation - prefilled from
   * isCustodyIsolation - only used for custody and admission to facility cases
   **********/
  @Column({ type: DataType.BOOLEAN, allowNull: true })
  @ApiPropertyOptional({ type: Boolean })
  isAppealCustodyIsolation?: boolean

  /**********
   * Expiration date and time for isolation - prefilled from isolationToDate - only used
   * for custody and admission to facility cases and only relevant if the judge imposes isolation
   **********/
  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  appealIsolationToDate?: Date

  /**********
   * Indicates whether someone requested that the appeals court's ruling should not
   * be published immediately.
   **********/
  @Column({
    type: DataType.ARRAY(DataType.ENUM),
    allowNull: true,
    values: Object.values(UserRole),
  })
  @ApiPropertyOptional({ enum: UserRole, isArray: true })
  requestAppealRulingNotToBePublished?: UserRole[]

  /**********
   * The surrogate key of the prosecutors office that created the case
   **********/
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
  prosecutorsOfficeId?: string

  /**********
   * The prosecutors office that created the case
   **********/
  @BelongsTo(() => Institution, 'prosecutorsOfficeId')
  @ApiPropertyOptional({ type: () => Institution })
  prosecutorsOffice?: Institution

  /**********
   * The explanation given for a denial of an indictment
   **********/
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  indictmentDeniedExplanation?: string

  /**********
   * The explanation given for the return of an indictment by the district court
   **********/
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  indictmentReturnedExplanation?: string

  /**********
   * The case's notifications
   **********/
  @HasMany(() => Notification, 'caseId')
  @ApiPropertyOptional({ type: Notification, isArray: true })
  notifications?: Notification[]

  /**********
   * The ruling decision in indictment cases - example: FINE
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CaseIndictmentRulingDecision),
  })
  @ApiPropertyOptional({ enum: CaseIndictmentRulingDecision })
  indictmentRulingDecision?: CaseIndictmentRulingDecision

  /**********
   * The surrogate key of the prosecutor assigned to review an indictment
   **********/
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
  indictmentReviewerId?: string

  /**********
   * The prosecutor assigned to review an indictment case
   **********/
  @BelongsTo(() => User, 'indictmentReviewerId')
  @ApiPropertyOptional({ type: User })
  indictmentReviewer?: User

  /**********
   * The review decision in indictment cases
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(IndictmentCaseReviewDecision),
  })
  @ApiPropertyOptional({ enum: IndictmentCaseReviewDecision })
  indictmentReviewDecision?: IndictmentCaseReviewDecision

  /**********
   * The judge's pending decision in indictment cases - example: POSTPONING
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(IndictmentDecision),
  })
  @ApiPropertyOptional({ enum: IndictmentDecision })
  indictmentDecision?: IndictmentDecision

  /**********
   * The hash of the confirmed generated indictment in indictment cases
   * and the hash algorithm used to create the hash
   **********/
  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  indictmentHash?: string

  /**********
   * The hash of the confirmed generated court record in indictment cases
   * and the hash algorithm used to create the hash
   **********/
  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  courtRecordHash?: string

  /**********
   * The court session type in indictment cases - example: MAIN_HEARING
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CourtSessionType),
  })
  @ApiPropertyOptional({ enum: CourtSessionType })
  courtSessionType?: CourtSessionType

  /**********
   * The surrogate key of the case an indictment was merged into
   * Only used if the case has been merged
   **********/
  @ForeignKey(() => Case)
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
  mergeCaseId?: string

  /**********
   * The case this case was merged into
   * Only used if the case was merged
   **********/
  @BelongsTo(() => Case, 'mergeCaseId')
  @ApiPropertyOptional({ type: () => Case })
  mergeCase?: Case

  /**********
   * The cases that have been merged into this case
   * Only used if other cases have been merged into this case
   **********/
  @HasMany(() => Case, 'mergeCaseId')
  @ApiPropertyOptional({ type: () => Case })
  mergedCases?: Case[]

  /**********
   * The court case number this case was merged into
   * Only used if the case was merged with a case that is not in RVG
   **********/
  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  mergeCaseNumber?: string

  /**********
   * Indicates whether a case should include any civil claims -
   * optional
   **********/
  @Column({ type: DataType.BOOLEAN, allowNull: true })
  @ApiPropertyOptional({ type: Boolean })
  hasCivilClaims?: boolean

  // /**********
  //  * The case's civil claimants
  //  **********/
  @HasMany(() => CivilClaimant, 'caseId')
  @ApiPropertyOptional({ type: () => CivilClaimant, isArray: true })
  civilClaimants?: CivilClaimant[]

  /**********
   * Indicates whether an investigation case was completed without a ruling -
   * optional
   **********/
  @Column({ type: DataType.BOOLEAN, allowNull: true })
  @ApiPropertyOptional({ type: Boolean })
  isCompletedWithoutRuling?: boolean

  /**********
   * NOTE: This is a temporary field to indicate whether a public prosecutors
   * user has marked a case as registered in the police system. This will be
   * removed in the future.
   **********/
  @Column({ type: DataType.BOOLEAN, allowNull: true })
  @ApiPropertyOptional({ type: Boolean })
  publicProsecutorIsRegisteredInPoliceSystem?: boolean

  /**********
   * The case's victims
   **********/
  @HasMany(() => Victim, 'caseId')
  @ApiPropertyOptional({ type: () => Victim, isArray: true })
  victims?: Victim[]

  /**********
   * Indicates whether a case is registered in the prison system
   **********/
  @Column({ type: DataType.BOOLEAN, allowNull: true })
  @ApiProperty({ type: Boolean })
  isRegisteredInPrisonSystem?: boolean

  /**********
   * The surrogate key of the case an indictment was split from
   * Only used if the case was split from another case
   **********/
  @ForeignKey(() => Case)
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
  splitCaseId?: string

  /**********
   * The case this case was split from
   * Only used if the case was split from another case
   **********/
  @BelongsTo(() => Case, 'splitCaseId')
  @ApiPropertyOptional({ type: () => Case })
  splitCase?: Case

  /**********
   * The cases that have split from this case
   * Only used if other cases have been split from this case
   **********/
  @HasMany(() => Case, 'splitCaseId')
  @ApiPropertyOptional({ type: () => Case })
  splitCases?: Case[]

  /**********
   * The defendant national id provided by the police system
   * Only used if the case was created from the police system
   **********/
  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  policeDefendantNationalId?: string
}
