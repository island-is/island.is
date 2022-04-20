import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Optional } from 'sequelize/types'

interface ResourceAttributes {
  id: string
  nationalId: string
  created: Date
  modified: Date
}

interface ResourceCreationAttributes
  extends Optional<ResourceAttributes, 'id' | 'created' | 'modified'> {}

@Table({
  tableName: 'resource',
  indexes: [
    {
      fields: ['national_id'],
    },
  ],
})
export class Resource extends Model<
  ResourceAttributes,
  ResourceCreationAttributes
> {
  @ApiProperty()
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  id!: string

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  nationalId!: string

  @ApiProperty()
  @CreatedAt
  readonly created!: Date

  @ApiProperty()
  @UpdatedAt
  readonly modified!: Date
}
