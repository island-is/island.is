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

@Table({
  tableName: 'indictment_count',
  timestamps: true,
})
export class IndictmentCount extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
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

  @ForeignKey(() => Case)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty()
  caseId!: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  policeCaseNumber?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  vehicleRegistrationNumber?: string

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  incidentDescription?: string

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  legal_arguments?: string
}
