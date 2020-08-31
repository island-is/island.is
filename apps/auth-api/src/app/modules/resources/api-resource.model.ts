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

  // Common properties for all resources (no single table inheritance)

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
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
  })
  @ApiProperty()
  showInDiscoveryDocument: boolean

  // Common properties end

  @CreatedAt
  @ApiProperty()
  readonly created: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified: Date

  @ApiProperty()
  public userClaims: string[]

  @ApiProperty()
  public scopes: string[]

  // TODO: Do we need to configure access token signing algoritms per api resource?
  // @ApiProperty()
  // public allowedAccessTokenSigningAlgorithms: string[]

  @HasMany(() => ApiResourceSecret)
  @ApiProperty()
  readonly apiSecrets: ApiResourceSecret[]
}
