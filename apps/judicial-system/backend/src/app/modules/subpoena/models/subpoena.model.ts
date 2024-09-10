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

import { Case } from '../../case/models/case.model'
import { Defendant } from '../../defendant/models/defendant.model'

@Table({
  tableName: 'subpoena',
  timestamps: false,
})
export class Subpoena extends Model {
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

  @ForeignKey(() => Defendant)
  @Column({ type: DataType.UUID, allowNull: false })
  defendantId!: string

  @ForeignKey(() => Case)
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiProperty({ type: String })
  caseId?: string

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  @ApiPropertyOptional({ type: Boolean })
  acknowledged?: string

  @ApiPropertyOptional({ type: String })
  @Column({ type: DataType.STRING, allowNull: true })
  subpoenaId?: string
}
