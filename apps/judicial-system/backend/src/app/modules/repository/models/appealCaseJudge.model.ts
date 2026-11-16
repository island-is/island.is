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

import { AppealCase } from './appealCase.model'
import { User } from './user.model'

// A judge sitting on an appeal case, one row per judge. The bench is ordered:
// the judge at display order 0 is the presiding judge (dómsformaður). Every kind
// of appeal case (ruling, ruling order and verdict appeals) shares this table,
// as they share appeal_case.
@Table({
  tableName: 'appeal_case_judge',
  timestamps: true,
})
export class AppealCaseJudge extends Model {
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

  @ForeignKey(() => AppealCase)
  @Column({ type: DataType.UUID, allowNull: false })
  @ApiProperty({ type: String })
  appealCaseId!: string

  @BelongsTo(() => AppealCase, 'appealCaseId')
  @ApiPropertyOptional({ type: () => AppealCase })
  appealCase?: AppealCase

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  @ApiProperty({ type: String })
  userId!: string

  @BelongsTo(() => User, 'userId')
  @ApiPropertyOptional({ type: User })
  user?: User

  // Position on the bench, from 0. The presiding judge is at 0.
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  @ApiProperty({ type: Number })
  displayOrder!: number
}
