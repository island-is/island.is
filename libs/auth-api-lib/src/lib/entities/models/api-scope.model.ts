import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
  HasMany,
  PrimaryKey,
  ForeignKey,
  HasOne,
  BelongsTo,
} from 'sequelize-typescript'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ApiScopeUserClaim } from './api-scope-user-claim.model'
import { ApiScopeGroup } from './api-scope-group.model'

@Table({
  tableName: 'api_scope',
})
export class ApiScope extends Model<ApiScope> {
  // Common properties for all resources (no single table inheritance)

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  name!: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty({
    example: true,
  })
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
    type: DataType.UUID,
    allowNull: true,
  })
  @ForeignKey(() => ApiScopeGroup)
  @ApiProperty()
  groupId?: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty({
    example: true,
  })
  showInDiscoveryDocument!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({
    example: true,
  })
  grantToLegalGuardians!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({
    example: true,
  })
  grantToProcuringHolders!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({
    example: true,
  })
  allowExplicitDelegationGrant!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({
    example: true,
  })
  automaticDelegationGrant!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({
    example: true,
  })
  alsoForDelegatedUser!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  @ApiProperty({
    example: true,
  })
  isAccessControlled?: boolean

  @HasMany(() => ApiScopeUserClaim)
  @ApiProperty()
  userClaims?: ApiScopeUserClaim[]

  // Common properties end
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({
    example: false,
  })
  required!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({
    example: false,
  })
  emphasize!: boolean

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  @ApiProperty({
    example: null,
  })
  archived!: Date

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date

  @ApiPropertyOptional()
  @BelongsTo(() => ApiScopeGroup)
  group?: ApiScopeGroup
}
