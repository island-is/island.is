import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { ApiResourceSecret } from './api-resource-secret.model'
import { ApiResourceUserClaim } from './api-resource-user-claim.model'
import { ApiResourceScope } from './api-resource-scope.model'

@Table({
  tableName: 'api_resource',
  indexes: [
    {
      fields: ['id'],
    },
  ],
})
export class ApiResource extends Model<ApiResource> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id: string
  
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty({
    example: 'domain_id',
  })
  domainId: string

  // Common properties for all resources (no single table inheritance)

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty()
  enabled: boolean

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  name: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  displayName: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  description: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty()
  showInDiscoveryDocument: boolean

  @HasMany(() => ApiResourceUserClaim)
  @ApiProperty()
  public userClaims: ApiResourceUserClaim[]

  // Common properties end

  @CreatedAt
  @ApiProperty()
  readonly created: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified: Date

  @HasMany(() => ApiResourceScope)
  @ApiProperty()
  public scopes: ApiResourceScope[]

  @HasMany(() => ApiResourceSecret)
  @ApiProperty()
  readonly apiSecrets: ApiResourceSecret[]

  // Signing algorithm for access token. If empty, will use the server default signing algorithm.
  // public allowedAccessTokenSigningAlgorithms
}
