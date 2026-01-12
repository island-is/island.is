import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { CourtSessionStringType } from '@island.is/judicial-system/types'

import { Case } from './case.model'
import { CourtSession } from './courtSession.model'

@Table({
  tableName: 'court_session_string',
  timestamps: true,
})
export class CourtSessionString extends Model {
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

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(CourtSessionStringType),
  })
  @ApiProperty({ enum: CourtSessionStringType })
  stringType!: CourtSessionStringType

  @ForeignKey(() => Case)
  @Column({ type: DataType.UUID, allowNull: false })
  @ApiProperty({ type: String })
  caseId!: string

  @ForeignKey(() => CourtSession)
  @Column({ type: DataType.UUID, allowNull: false })
  @ApiProperty({ type: String })
  courtSessionId!: string

  @ForeignKey(() => Case)
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
  mergedCaseId?: string

  @Column({ type: DataType.TEXT, allowNull: false })
  @ApiProperty({ type: String })
  value!: string
}
