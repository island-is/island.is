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
import { ApiResourceSecret } from './api-resource-secret.model'
import { ApiResourceUserClaim } from './api-resource-user-claim.model'
import { ApiResourceScope } from './api-resource-scope.model'

@Table({
  tableName: 'api_resource',
})
export class ApiResource extends Model {
  // Common properties for all resources (no single table inheritance)

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  name!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    example: '1234567890',
  })
  nationalId!: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty()
  enabled!: boolean

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  displayName!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  description!: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty()
  showInDiscoveryDocument!: boolean

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  @ApiProperty({
    example: null,
  })
  archived!: Date

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  @ApiProperty({
    example: null,
  })
  contactEmail!: string

  @HasMany(() => ApiResourceUserClaim)
  @ApiProperty()
  userClaims?: ApiResourceUserClaim[]

  // Common properties end

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date

  @HasMany(() => ApiResourceScope)
  @ApiProperty()
  scopes?: ApiResourceScope[]

  @HasMany(() => ApiResourceSecret)
  @ApiProperty()
  apiSecrets?: ApiResourceSecret[]

  // Signing algorithm for access token. If empty, will use the server default signing algorithm.
  // public allowedAccessTokenSigningAlgorithms
}
