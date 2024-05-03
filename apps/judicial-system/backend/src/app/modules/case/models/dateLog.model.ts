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

import { DateType } from '@island.is/judicial-system/types'

import { Case } from './case.model'

@Table({
  tableName: 'date_log',
  timestamps: false,
})
export class DateLog extends Model {
  static arraignmentDate(dateLogs?: DateLog[]) {
    return dateLogs?.find(
      (dateLog) => dateLog.dateType === DateType.ARRAIGNMENT_DATE,
    )
  }

  static courtDate(dateLogs?: DateLog[]) {
    return dateLogs?.find((dateLog) => dateLog.dateType === DateType.COURT_DATE)
  }

  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @CreatedAt
  @ApiProperty()
  created!: Date

  @UpdatedAt
  @ApiProperty()
  modified!: Date

  @Column({ type: DataType.STRING })
  @ApiProperty()
  dateType!: DateType

  @ForeignKey(() => Case)
  @Column({ type: DataType.UUID })
  @ApiProperty()
  caseId!: string

  @Column({ type: DataType.DATE })
  @ApiProperty()
  date!: Date

  @Column({ type: DataType.STRING })
  @ApiPropertyOptional()
  location?: string
}
