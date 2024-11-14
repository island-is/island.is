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

import { Case } from '../../case/models/case.model'
import { Defendant } from './defendant.model'

@Table({
  tableName: 'defendant_event_log',
  timestamps: true,
})
export class DefendantEventLog extends Model {
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

  @ForeignKey(() => Defendant)
  @Column({ type: DataType.UUID, allowNull: false })
  @ApiProperty({ type: String })
  defendantId!: string

  @BelongsTo(() => Case, 'defendant_id')
  @ApiPropertyOptional({ type: () => Defendant })
  defendant?: Defendant

  @Column({ type: DataType.STRING, allowNull: false })
  @ApiProperty({ type: String })
  eventType!: string
}
