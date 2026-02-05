import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'
import {
  DefendantPlea,
  DefenderChoice,
  Gender,
  IndictmentCaseReviewDecision,
  PunishmentType,
  SubpoenaType,
} from '@island.is/judicial-system/types'

import { Case } from './case.model'
import { DefendantEventLog } from './defendantEventLog.model'
import { Subpoena } from './subpoena.model'
import { Verdict } from './verdict.model'

@Table({
  tableName: 'defendant',
  timestamps: true,
})
export class Defendant extends Model {
  static isConfirmedDefenderOfDefendant(
    defenderNationalId: string,
    defendants?: Defendant[],
  ) {
    return defendants?.some(
      (defendant) =>
        defendant.isDefenderChoiceConfirmed &&
        defendant.defenderNationalId &&
        normalizeAndFormatNationalId(defenderNationalId).includes(
          defendant.defenderNationalId,
        ),
    )
  }

  static isConfirmedDefenderOfDefendantWithCaseFileAccess(
    defenderNationalId: string,
    defendants?: Defendant[],
  ) {
    return defendants?.some(
      (defendant) =>
        defendant.isDefenderChoiceConfirmed &&
        defendant.caseFilesSharedWithDefender &&
        defendant.defenderNationalId &&
        normalizeAndFormatNationalId(defenderNationalId).includes(
          defendant.defenderNationalId,
        ),
    )
  }

  static isConfirmedDefenderOfSpecificDefendantWithCaseFileAccess(
    defenderNationalId: string,
    defendantId: string,
    defendants?: Defendant[],
  ) {
    const defendant = defendants?.find((d) => d.id === defendantId)
    if (!defendant) {
      return false
    }
    return (
      defendant.isDefenderChoiceConfirmed &&
      defendant.caseFilesSharedWithDefender &&
      defendant.defenderNationalId &&
      normalizeAndFormatNationalId(defenderNationalId).includes(
        defendant.defenderNationalId,
      )
    )
  }

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

  @ForeignKey(() => Case)
  @Column({ type: DataType.UUID, allowNull: false })
  @ApiProperty({ type: String })
  caseId!: string

  @BelongsTo(() => Case, 'caseId')
  @ApiPropertyOptional({ type: () => Case })
  case?: Case

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  @ApiPropertyOptional({ type: Boolean })
  noNationalId?: boolean

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  nationalId?: string

  // ATTENTION: This will contain the DOB from **LOKE** but we can migrate later internal DOB currently stored as nationalId in the same schema
  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  dateOfBirth?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  name?: string

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(Gender),
  })
  @ApiPropertyOptional({ enum: Gender })
  gender?: Gender

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  address?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  citizenship?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  defenderName?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  defenderNationalId?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  defenderEmail?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  defenderPhoneNumber?: string

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(DefenderChoice),
  })
  @ApiPropertyOptional({ enum: DefenderChoice })
  defenderChoice?: DefenderChoice

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(DefendantPlea),
  })
  @ApiProperty({ enum: DefendantPlea })
  defendantPlea?: DefendantPlea

  // This is the currently selected subpoena type per defendant but we also
  // store the subpoena type in the subpoenas table to keep the history.
  // We will later remove it from the defendant table when we fix the
  // handling of new subpoenas per defendant.
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(SubpoenaType),
  })
  @ApiPropertyOptional({ enum: SubpoenaType })
  subpoenaType?: SubpoenaType

  @HasMany(() => Subpoena, { foreignKey: 'defendantId' })
  @ApiPropertyOptional({ type: () => Subpoena, isArray: true })
  subpoenas?: Subpoena[]

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(DefenderChoice),
  })
  @ApiPropertyOptional({ enum: DefenderChoice })
  requestedDefenderChoice?: DefenderChoice

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  requestedDefenderNationalId?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  requestedDefenderName?: string

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  @ApiPropertyOptional({ type: Boolean })
  isDefenderChoiceConfirmed?: boolean

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  @ApiPropertyOptional({ type: Boolean })
  caseFilesSharedWithDefender?: boolean

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  @ApiPropertyOptional({ type: Boolean })
  isSentToPrisonAdmin?: boolean

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(PunishmentType),
  })
  @ApiPropertyOptional({ enum: PunishmentType })
  punishmentType?: PunishmentType

  @HasMany(() => DefendantEventLog, { foreignKey: 'defendantId' })
  @ApiPropertyOptional({ type: () => DefendantEventLog, isArray: true })
  eventLogs?: DefendantEventLog[]

  // Note: specific for subpoena service, if it was delivered via specific process like the legal paper
  @Column({ type: DataType.BOOLEAN, allowNull: true })
  @ApiPropertyOptional({ type: Boolean })
  isAlternativeService?: boolean

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  alternativeServiceDescription?: string

  @HasMany(() => Verdict, { foreignKey: 'defendantId' })
  @ApiPropertyOptional({ type: () => Verdict, isArray: true })
  verdicts?: Verdict[]

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(IndictmentCaseReviewDecision),
  })
  @ApiPropertyOptional({ enum: IndictmentCaseReviewDecision })
  indictmentReviewDecision?: IndictmentCaseReviewDecision
}
