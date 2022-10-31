import type { Optional } from 'sequelize'
import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
  HasMany,
  PrimaryKey,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { ApiScopeUserAccess } from './api-scope-user-access.model'

interface ModelAttributes {
  nationalId: string
  email: string
  created: Date
  modified?: Date
}

type CreationAttributes = Optional<ModelAttributes, 'created'>

@Table({
  tableName: 'api_scope_user',
})
export class ApiScopeUser extends Model<ModelAttributes, CreationAttributes> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  nationalId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty({
    example: 'something@domain.com',
  })
  email!: string

  @HasMany(() => ApiScopeUserAccess)
  @ApiProperty()
  userAccess?: ApiScopeUserAccess[]

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date
}
