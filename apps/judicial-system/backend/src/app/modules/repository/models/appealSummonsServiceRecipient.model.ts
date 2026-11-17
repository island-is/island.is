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

import { VerdictServiceStatus } from '@island.is/judicial-system/types'

import { AppealSummons } from './appealSummons.model'
import { CivilClaimant } from './civilClaimant.model'
import { Defendant } from './defendant.model'

@Table({
  tableName: 'appeal_summons_service',
  timestamps: true,
})
export class AppealSummonsServiceRecipient extends Model {
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

  @ForeignKey(() => AppealSummons)
  @Column({ type: DataType.UUID, allowNull: false })
  @ApiProperty({ type: String })
  appealSummonsId!: string

  @BelongsTo(() => AppealSummons, 'appealSummonsId')
  @ApiProperty({ type: () => AppealSummons })
  appealSummons?: AppealSummons

  @ForeignKey(() => Defendant)
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
  defendantId?: string

  @BelongsTo(() => Defendant, 'defendantId')
  @ApiPropertyOptional({ type: () => Defendant })
  defendant?: Defendant

  @ForeignKey(() => CivilClaimant)
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
  civilClaimantId?: string

  @BelongsTo(() => CivilClaimant, 'civilClaimantId')
  @ApiPropertyOptional({ type: () => CivilClaimant })
  civilClaimant?: CivilClaimant

  @Column({ type: DataType.DATE, allowNull: false })
  @ApiProperty({ type: Date })
  sentToServiceDate!: Date

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  externalPoliceDocumentId?: string

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
}
