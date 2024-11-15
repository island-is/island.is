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
  DefendantEventType,
  DefendantPlea,
  DefenderChoice,
  Gender,
  ServiceRequirement,
  SubpoenaType,
} from '@island.is/judicial-system/types'

import { Case } from '../../case/models/case.model'
import { Subpoena } from '../../subpoena/models/subpoena.model'
import { DefendantEventLog } from './eventLog.model'

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

  static isSentToPrisonAdmin(defendant: Defendant) {
    return DefendantEventLog.findOne({
      where: {
        defendantId: defendant.id,
        eventType: DefendantEventType.SENT_TO_PRISON_ADMIN,
      },
    }).then(async (eventLog) => {
      console.log({ eventLog })
      if (eventLog) {
        const [numberOfAffectedRows] = await Defendant.update(
          { isSentToPrisonAdmin: true },
          { where: { id: defendant.id } },
        )
        if (numberOfAffectedRows > 0) {
          return true
        }
      }
      return false
    })
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

  @BelongsTo(() => Case, 'case_id')
  @ApiPropertyOptional({ type: () => Case })
  case?: Case

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  @ApiPropertyOptional({ type: Boolean })
  noNationalId?: boolean

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  nationalId?: string

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

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(ServiceRequirement),
  })
  @ApiProperty({ enum: ServiceRequirement })
  serviceRequirement?: ServiceRequirement

  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  verdictViewDate?: Date

  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  verdictAppealDate?: Date

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
}
