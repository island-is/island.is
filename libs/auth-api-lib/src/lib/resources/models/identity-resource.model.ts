import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { Domain } from './domain.model'
import { IdentityResourceUserClaim } from './identity-resource-user-claim.model'

@Table({
  tableName: 'identity_resource',
})
export class IdentityResource extends Model {
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

  @HasMany(() => IdentityResourceUserClaim)
  @ApiProperty()
  userClaims?: IdentityResourceUserClaim[]

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

  @ApiPropertyOptional({ type: () => Domain })
  domain?: Domain
}
