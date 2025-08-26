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

import {
  IndictmentCountOffense,
  type SubstanceMap,
} from '@island.is/judicial-system/types'

import { IndictmentCount } from './indictmentCount.model'

@Table({
  tableName: 'offense',
  timestamps: true,
})
export class Offense extends Model {
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

  @ForeignKey(() => IndictmentCount)
  @Column({ type: DataType.UUID, allowNull: false })
  @ApiProperty({ type: String })
  indictmentCountId!: string

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(IndictmentCountOffense),
  })
  @ApiProperty({ enum: IndictmentCountOffense })
  offense!: IndictmentCountOffense

  @Column({ type: DataType.JSONB, allowNull: true })
  @ApiPropertyOptional({ type: Object })
  substances?: SubstanceMap
}
