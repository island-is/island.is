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
export class ApiScopeUser extends Model {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  nationalId!: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty({
    example: true,
  })
  email!: boolean

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
