import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { DateType } from '@island.is/judicial-system/types'

import { Case } from './case.model'

@Table({
  tableName: 'date_log',
  timestamps: false,
})
export class DateLog extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @CreatedAt
  @Column({ type: DataType.DATE })
  @ApiProperty()
  created!: Date

  @Column({ type: DataType.STRING })
  @ApiProperty()
  dateType!: DateType

  @ForeignKey(() => Case)
  @Column({ type: DataType.UUID })
  @ApiPropertyOptional()
  caseId!: string

  @Column({ type: DataType.DATE })
  @ApiPropertyOptional()
  date!: Date

  @Column({ type: DataType.STRING })
  @ApiPropertyOptional()
  location!: string
}
