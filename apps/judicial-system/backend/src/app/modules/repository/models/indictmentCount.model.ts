import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { IndictmentSubtype } from '@island.is/judicial-system/types'

import { Case } from './case.model'
import { Offense } from './offense.model'

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

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  policeCaseNumber?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  vehicleRegistrationNumber?: string

  @HasMany(() => Offense, 'indictmentCountId')
  @ApiPropertyOptional({ type: () => Offense, isArray: true })
  offenses?: Offense[]

  @Column({ type: DataType.JSONB, allowNull: true })
  @ApiPropertyOptional({ type: [Number, Number], isArray: true })
  lawsBroken?: [number, number][]

  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  incidentDescription?: string

  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  legalArguments?: string

  @Column({
    type: DataType.ARRAY(DataType.ENUM),
    allowNull: true,
    values: Object.values(IndictmentSubtype),
  })
  @ApiPropertyOptional({ enum: IndictmentSubtype, isArray: true })
  indictmentCountSubtypes?: IndictmentSubtype[]

  @Column({ type: DataType.INTEGER, allowNull: true })
  @ApiPropertyOptional({ type: Number })
  recordedSpeed?: number

  @Column({ type: DataType.INTEGER, allowNull: true })
  @ApiPropertyOptional({ type: Number })
  speedLimit?: number
}
