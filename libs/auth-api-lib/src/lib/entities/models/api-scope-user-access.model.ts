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

@Table({
  tableName: 'api_scope_user_access',
})
export class ApiScopeUserAccess extends Model<ApiScopeUserAccess> {
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
  scope!: boolean

  // @HasMany(() => ApiScopeUserClaim)
  // @ApiProperty()
  // userClaims?: ApiScopeUserClaim[]

  // Common properties end

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date
}
