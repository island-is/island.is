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

import { Case } from './case.model'

@Table({
  tableName: 'police_digital_case_file',
  timestamps: true,
})
export class PoliceDigitalCaseFile extends Model {
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

  @Column({ type: DataType.STRING, allowNull: false })
  @ApiProperty({ type: String })
  policeCaseNumber!: string

  @Column({ type: DataType.STRING, allowNull: false })
  @ApiProperty({ type: String })
  policeDigitalFileId!: string

  @Column({ type: DataType.STRING, allowNull: false })
  @ApiProperty({ type: String })
  policeExternalVendorId!: string

  @Column({ type: DataType.STRING, allowNull: false })
  @ApiProperty({ type: String })
  name!: string

  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  displayDate?: Date

  @Column({ type: DataType.INTEGER, allowNull: true })
  @ApiPropertyOptional({ type: Number })
  orderWithinChapter?: number
}
