import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import {
  CaseAppealRulingDecision,
  CaseAppealState,
  UserRole,
} from '@island.is/judicial-system/types'

import { Case } from './case.model'
import { User } from './user.model'

@Table({
  tableName: 'appeal_case',
  timestamps: true,
})
export class AppealCase extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty({ type: String })
  id!: string

  @CreatedAt
  @ApiProperty({ type: Date })
  created!: Date

  @UpdatedAt
  @ApiProperty({ type: Date })
  modified!: Date

  /**********
   * The surrogate key of the case
   **********/
  @ForeignKey(() => Case)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  @ApiProperty({ type: String })
  caseId!: string

  /**********
   * The case
   **********/
  @BelongsTo(() => Case, 'caseId')
  @ApiPropertyOptional({ type: () => Case })
  case?: Case

  /**********
   * The case appeal state
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(CaseAppealState),
  })
  @ApiProperty({ enum: CaseAppealState })
  appealState!: CaseAppealState

  /**********
   * The appeal case number assigned in the court of appeals
   **********/
  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  appealCaseNumber?: string

  /**********
   * The time and date that the court marked an appeal as received
   **********/
  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  appealReceivedByCourtDate?: Date

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
   * The case appeal ruling decision
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CaseAppealRulingDecision),
  })
  @ApiPropertyOptional({ enum: CaseAppealRulingDecision })
  appealRulingDecision?: CaseAppealRulingDecision

  /**********
   * The appeal conclusion
   **********/
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  appealConclusion?: string

  /**********
   * The history on when a case's appeal ruling was modified
   **********/
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  appealRulingModifiedHistory?: string

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
   * The national ID of the person who filed the appeal — used for indictment
   * cases where multiple defenders/civil claimant lawyers exist.
   * Not used for request cases.
   **********/
  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  appealedByNationalId?: string
}
