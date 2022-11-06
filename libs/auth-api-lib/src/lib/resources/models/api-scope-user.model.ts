import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'
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

@Table({
  tableName: 'api_scope_user',
})
export class ApiScopeUser extends Model<
  InferAttributes<ApiScopeUser>,
  InferCreationAttributes<ApiScopeUser>
> {
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
  readonly created!: CreationOptional<Date>

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date
}
