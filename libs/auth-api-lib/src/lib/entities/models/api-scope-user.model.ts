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
  tableName: 'api_scope_user',
})
export class ApiScopeUser extends Model<ApiScopeUser> {
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
