import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
  ForeignKey,
  PrimaryKey,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { ApiScope } from './api-scope.model'

@Table({
  tableName: 'api_scope_user_claim',
  indexes: [
    {
      fields: ['api_scope_id', 'claim_name'],
    },
  ],
})
export class ApiScopeUserClaim extends Model<ApiScopeUserClaim> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ForeignKey(() => ApiScope)
  @ApiProperty()
  apiScopeId: string

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  claimName: string

  @CreatedAt
  @ApiProperty()
  readonly created: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified: Date
}
