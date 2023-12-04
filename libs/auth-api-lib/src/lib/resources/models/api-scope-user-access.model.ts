import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiScopeUser } from './api-scope-user.model'
import { ApiScope } from './api-scope.model'

@Table({
  tableName: 'api_scope_user_access',
})
export class ApiScopeUserAccess extends Model {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ForeignKey(() => ApiScopeUser)
  @ApiProperty()
  nationalId!: string

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: true,
  })
  @ForeignKey(() => ApiScope)
  @ApiProperty({
    example: 'scope-example',
  })
  scope!: string

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date
}
