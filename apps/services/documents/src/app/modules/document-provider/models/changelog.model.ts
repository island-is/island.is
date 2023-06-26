import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
} from 'sequelize-typescript'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Organisation } from './organisation.model'
import { EntityTypes } from '../enums/EntityTypes'

@Table({
  tableName: 'changelog',
  timestamps: true,
  indexes: [
    {
      fields: ['organisation_id', 'entity_id'],
    },
  ],
})
export class Changelog extends Model {
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
