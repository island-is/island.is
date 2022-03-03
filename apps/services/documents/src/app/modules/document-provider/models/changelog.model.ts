import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { EntityTypes } from '../enums/EntityTypes'

import { Organisation } from './organisation.model'

@Table({
  tableName: 'changelog',
  timestamps: true,
  indexes: [
    {
      fields: ['organisation_id', 'entity_id'],
    },
  ],
})
export class Changelog extends Model<Changelog> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @ForeignKey(() => Organisation)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  organisationId!: string

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  entityId?: string

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(EntityTypes),
  })
  @ApiProperty({ enum: EntityTypes })
  entityType?: string

  @Column({
    type: DataType.JSONB,
    defaultValue: {},
  })
  @ApiPropertyOptional()
  data?: object

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date
}
