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
  HashAlgorithm,
  ServiceRequirement,
  VerdictAppealDecision,
  VerdictServiceStatus,
} from '@island.is/judicial-system/types'

import { AppealCase } from './appealCase.model'
import { Case } from './case.model'
import { Defendant } from './defendant.model'

@Table({
  tableName: 'appeal_verdict',
  timestamps: true,
})
export class AppealVerdict extends Model {
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

  @ForeignKey(() => AppealCase)
  @Column({ type: DataType.UUID, allowNull: false })
  @ApiProperty({ type: String })
  appealCaseId!: string

  @BelongsTo(() => AppealCase, 'appealCaseId')
  @ApiPropertyOptional({ type: () => AppealCase })
  appealCase?: AppealCase

  @ForeignKey(() => Defendant)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  @ApiProperty({ type: String })
  defendantId!: string

  @BelongsTo(() => Defendant, 'defendantId')
  @ApiPropertyOptional({ type: () => Defendant })
  defendant?: Defendant

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  externalPoliceDocumentId?: string

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(ServiceRequirement),
  })
  @ApiPropertyOptional({ enum: ServiceRequirement })
  serviceRequirement?: ServiceRequirement

  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  sentToServiceDate?: Date

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(VerdictServiceStatus),
  })
  @ApiPropertyOptional({ enum: VerdictServiceStatus })
  serviceStatus?: VerdictServiceStatus

  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  serviceDate?: Date

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  servedBy?: string

  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  comment?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  hash?: string

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(HashAlgorithm),
  })
  @ApiPropertyOptional({ enum: HashAlgorithm })
  hashAlgorithm?: HashAlgorithm

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(VerdictAppealDecision),
  })
  @ApiPropertyOptional({ enum: VerdictAppealDecision })
  appealDecision?: VerdictAppealDecision

  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  appealDate?: Date

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  deliveredToDefenderNationalId?: string
}
