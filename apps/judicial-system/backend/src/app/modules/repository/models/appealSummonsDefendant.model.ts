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

import { ApiProperty } from '@nestjs/swagger'

import { AppealSummonsAppellantSide } from '@island.is/judicial-system/types'

import { AppealSummons } from './appealSummons.model'
import { Defendant } from './defendant.model'

@Table({
  tableName: 'appeal_summons_defendant',
  timestamps: true,
})
export class AppealSummonsDefendant extends Model {
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
  @Column({ type: DataType.UUID, allowNull: false })
  @ApiProperty({ type: String })
  defendantId!: string

  @BelongsTo(() => Defendant, 'defendantId')
  @ApiProperty({ type: () => Defendant })
  defendant?: Defendant

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({ enum: AppealSummonsAppellantSide })
  appellantSide!: AppealSummonsAppellantSide

  @Column({ type: DataType.TEXT, allowNull: false })
  @ApiProperty({ type: String })
  claims!: string
}
