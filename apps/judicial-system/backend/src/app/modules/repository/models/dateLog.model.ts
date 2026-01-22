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
  timestamps: true,
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
    values: Object.values(DateType),
  })
  @ApiProperty({ enum: DateType })
  dateType!: DateType

  @ForeignKey(() => Case)
  @Column({ type: DataType.UUID, allowNull: false })
  @ApiProperty({ type: String })
  caseId!: string

  @Column({ type: DataType.DATE, allowNull: false })
  @ApiProperty({ type: Date })
  date!: Date

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  location?: string
}
