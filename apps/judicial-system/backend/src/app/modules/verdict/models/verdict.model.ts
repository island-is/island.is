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
  InformationForDefendant,
  ServiceRequirement,
  ServiceStatus,
  VerdictAppealDecision,
} from '@island.is/judicial-system/types'

import { Case } from '../../case/models/case.model'
import { Defendant } from '../../defendant/models/defendant.model'

@Table({
  tableName: 'verdict',
  timestamps: true,
})
export class Verdict extends Model {
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

  @ApiPropertyOptional({ type: String })
  @Column({ type: DataType.STRING, allowNull: true })
  externalPoliceDocumentId?: string

  @ForeignKey(() => Defendant)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  defendantId!: string

  @BelongsTo(() => Defendant, 'defendantId')
  @ApiProperty({ type: () => Defendant })
  defendant?: Defendant

  @ForeignKey(() => Case)
  @Column({ type: DataType.UUID, allowNull: false })
  @ApiProperty({ type: String })
  caseId!: string

  @BelongsTo(() => Case, 'caseId')
  @ApiPropertyOptional({ type: () => Case })
  case?: Case

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(ServiceRequirement),
  })
  @ApiProperty({ enum: ServiceRequirement })
  serviceRequirement?: ServiceRequirement

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(ServiceStatus),
  })
  @ApiPropertyOptional({ enum: ServiceStatus })
  serviceStatus?: ServiceStatus

  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  serviceDate?: Date // birtingardagsetningin

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

  @Column({
    type: DataType.ARRAY(DataType.ENUM),
    allowNull: true,
    values: Object.values(InformationForDefendant),
  })
  @ApiPropertyOptional({ enum: InformationForDefendant, isArray: true })
  serviceInformationForDefendant?: InformationForDefendant[]
}
