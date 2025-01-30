import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { SubstanceMap } from '@island.is/judicial-system/types'

import { IndictmentCount } from './indictmentCount.model'

@Table({
  tableName: 'offense',
  timestamps: false,
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

  @ForeignKey(() => IndictmentCount)
  @Column({ type: DataType.UUID, allowNull: false })
  @ApiProperty({ type: String })
  indictment_count_id!: string

  @Column({ type: DataType.STRING, allowNull: false })
  @ApiProperty({ type: String })
  type!: string

  @Column({ type: DataType.JSONB, allowNull: true })
  @ApiPropertyOptional({ type: Object })
  substances?: SubstanceMap
}
