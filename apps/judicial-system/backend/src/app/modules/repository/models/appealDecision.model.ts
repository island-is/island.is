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
  AppealDecisionPartyRole,
  CaseAppealDecision,
} from '@island.is/judicial-system/types'

import { Case } from './case.model'
import { CaseFile } from './caseFile.model'
import { CivilClaimant } from './civilClaimant.model'
import { Defendant } from './defendant.model'

// An appeal decision made IN COURT (Ákvörðun um kæru), one row per party: the
// party's stance toward the ruling and its announcement. For request cases
// (rulingFileId null) there is one prosecution row and one collective defence
// row (no defendantId); for ruling orders (rulingFileId set) there is one
// prosecution row and one row per defendant / civil claimant. Indictment
// case-level (dismissal) appeals are out of court and are not stored here.
//
// "Who appealed" out of court is tracked in appeal_event_log, not here - so a
// decision row carries no appeal case link; it and the appeal case it produces
// share (caseId, rulingFileId). The recording court session is likewise
// derivable from rulingFileId (court_session.rulingFileId is 1:1 with a ruling
// order), so it is not stored.
//
// Uniqueness of (caseId, rulingFileId, partyRole, defendantId, civilClaimantId)
// is enforced via a composite UNIQUE index with NULLS NOT DISTINCT, and party
// reference consistency via a CHECK constraint.
@Table({
  tableName: 'appeal_decision',
  timestamps: true,
})
export class AppealDecision extends Model {
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
  @Column({ type: DataType.UUID, allowNull: false })
  @ApiProperty({ type: String })
  caseId!: string

  /**********
   * The case
   **********/
  @BelongsTo(() => Case, 'caseId')
  @ApiPropertyOptional({ type: () => Case })
  case?: Case

  /**********
   * The surrogate key of the ruling order file the decision applies to -
   * null for the case-level ruling
   **********/
  @ForeignKey(() => CaseFile)
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
  rulingFileId?: string

  /**********
   * The ruling order file the decision applies to
   **********/
  @BelongsTo(() => CaseFile, 'rulingFileId')
  @ApiPropertyOptional({ type: () => CaseFile })
  rulingFile?: CaseFile

  /**********
   * The role of the party the decision belongs to
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(AppealDecisionPartyRole),
  })
  @ApiProperty({ enum: AppealDecisionPartyRole })
  partyRole!: AppealDecisionPartyRole

  /**********
   * The surrogate key of the defendant - set for ruling-order DEFENDANT rows
   * (request-case defence rows carry none)
   **********/
  @ForeignKey(() => Defendant)
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
  defendantId?: string

  /**********
   * The defendant
   **********/
  @BelongsTo(() => Defendant, 'defendantId')
  @ApiPropertyOptional({ type: () => Defendant })
  defendant?: Defendant

  /**********
   * The surrogate key of the civil claimant - set for ruling-order
   * CIVIL_CLAIMANT rows
   **********/
  @ForeignKey(() => CivilClaimant)
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
  civilClaimantId?: string

  /**********
   * The civil claimant
   **********/
  @BelongsTo(() => CivilClaimant, 'civilClaimantId')
  @ApiPropertyOptional({ type: () => CivilClaimant })
  civilClaimant?: CivilClaimant

  /**********
   * The party's stance toward the ruling as recorded in court -
   * APPEAL means the party appealed in court (kært í þinghaldi). Nullable:
   * a row may hold an announcement entered before the decision is picked.
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CaseAppealDecision),
  })
  @ApiPropertyOptional({ enum: CaseAppealDecision })
  decision?: CaseAppealDecision

  /**********
   * The party's announcement (yfirlýsing) accompanying the decision -
   * optional (an ACCEPT / NOT_APPLICABLE decision has none)
   **********/
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  announcement?: string
}
