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
  BelongsTo,
} from 'sequelize-typescript'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ApiScopeUserClaim } from './api-scope-user-claim.model'
import { ApiScopeGroup } from './api-scope-group.model'
import { ApiScopesDTO } from '../dto/api-scopes.dto'
import { DelegationScope } from './delegation-scope.model'

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
    type: DataType.UUID,
    allowNull: true,
  })
  @ForeignKey(() => ApiScopeGroup)
  @ApiPropertyOptional({ nullable: true })
  groupId?: string | null

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty()
  showInDiscoveryDocument!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  grantToLegalGuardians!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  grantToProcuringHolders!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  allowExplicitDelegationGrant!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  automaticDelegationGrant!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  alsoForDelegatedUser!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiPropertyOptional({ nullable: true })
  isAccessControlled?: boolean | null

  @HasMany(() => ApiScopeUserClaim)
  @ApiPropertyOptional({ nullable: true })
  userClaims?: ApiScopeUserClaim[]

  // Common properties end
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  required!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  emphasize!: boolean

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  @ApiProperty({ nullable: true })
  archived!: Date | null

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiPropertyOptional({ nullable: true })
  readonly modified?: Date | null

  @BelongsTo(() => ApiScopeGroup)
  @ApiPropertyOptional({ nullable: true })
  group?: ApiScopeGroup | null

  @HasMany(() => DelegationScope)
  delegationScopes?: DelegationScope[]

  toDTO(): ApiScopesDTO {
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
