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

import { AppealCourtSessionType } from '@island.is/judicial-system/types'

import { AppealCase } from './appealCase.model'
import { Case } from './case.model'

// A session the court of appeals has called in a verdict appeal: what kind,
// when and in which room. Separate from the district court's court_session,
// which carries a whole court record; this is a booking.
@Table({
  tableName: 'appeal_court_session',
  timestamps: true,
})
export class AppealCourtSession extends Model {
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

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(AppealCourtSessionType),
  })
  @ApiProperty({ enum: AppealCourtSessionType })
  sessionType!: AppealCourtSessionType

  @Column({ type: DataType.DATE, allowNull: false })
  @ApiProperty({ type: Date })
  sessionDate!: Date

  @Column({ type: DataType.STRING, allowNull: false })
  @ApiProperty({ type: String })
  courtRoom!: string
}
