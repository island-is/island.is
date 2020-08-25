import {
    Column,
    CreatedAt,
    DataType,
    Model,
    Table,
    UpdatedAt,
    ForeignKey,
    BelongsTo,
    PrimaryKey,
  } from 'sequelize-typescript'
  import { ApiProperty } from '@nestjs/swagger'
import { IdentityResource } from './identity-resource.model'
import { ApiScope } from './api-scope.model'
  
  @Table({
    tableName: 'identity_resource_user_claim',
    indexes: [
      {
        fields: ['identity_resource_id', 'claim_name'],
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
  