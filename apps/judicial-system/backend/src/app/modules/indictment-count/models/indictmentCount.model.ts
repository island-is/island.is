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

import type { SubstanceMap } from '@island.is/judicial-system/types'
import { IndictmentCountOffense } from '@island.is/judicial-system/types'

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
  @Column({ type: DataType.UUID, allowNull: false })
  @ApiProperty()
  caseId!: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional()
  policeCaseNumber?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional()
  vehicleRegistrationNumber?: string

  @Column({ type: DataType.JSONB, allowNull: true })
  @ApiPropertyOptional({ enum: IndictmentCountOffense, isArray: true })
  offenses?: IndictmentCountOffense[]

  @Column({ type: DataType.JSONB, allowNull: true })
  @ApiPropertyOptional()
  substances?: SubstanceMap

  @Column({ type: DataType.JSONB, allowNull: true })
  @ApiPropertyOptional({ type: [[Number, Number]], isArray: true })
  lawsBroken?: [number, number][]

  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional()
  incidentDescription?: string

  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional()
  legalArguments?: string
}
