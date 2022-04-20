import {
  Column,
  CreatedAt,
  BelongsTo,
  DataType,
  Model,
  Table,
  UpdatedAt,
  HasMany,
  PrimaryKey,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { IdentityResourceUserClaim } from './identity-resource-user-claim.model'
import { DelegationScope } from './delegation-scope.model'
import { IdentityResourcesDTO } from '../dto/identity-resources.dto'

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

  @HasMany(() => DelegationScope)
  delegationScopes?: DelegationScope[]

  toDTO(): IdentityResourcesDTO {
    return {
      name: this.name,
      enabled: this.enabled,
      displayName: this.displayName,
      description: this.description,
      showInDiscoveryDocument: this.showInDiscoveryDocument,
      grantToLegalGuardians: this.grantToLegalGuardians,
      grantToProcuringHolders: this.grantToProcuringHolders,
      allowExplicitDelegationGrant: this.allowExplicitDelegationGrant,
      automaticDelegationGrant: this.automaticDelegationGrant,
      alsoForDelegatedUser: this.alsoForDelegatedUser,
      required: this.required,
      emphasize: this.emphasize,
    }
  }
}
