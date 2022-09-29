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
import { DelegationScope } from '../../delegations/models/delegation-scope.model'
import { PersonalRepresentativeScopePermission } from '../../personal-representative/models/personal-representative-scope-permission.model'
import { Optional } from 'sequelize/types'

interface ModelAttributes {
  name: string
  enabled: boolean
  displayName: string
  description: string
  groupId?: string | null
  showInDiscoveryDocument: boolean
  grantToLegalGuardians: boolean
  grantToProcuringHolders: boolean
  grantToPersonalRepresentatives: boolean
  allowExplicitDelegationGrant: boolean
  automaticDelegationGrant: boolean
  alsoForDelegatedUser: boolean
  isAccessControlled?: boolean
  userClaims?: ApiScopeUserClaim[]
  required: boolean
  emphasize: boolean
  archived?: Date | null
  created: Date
  modified?: Date
  group?: ApiScopeGroup
  delegationScopes?: DelegationScope[]
  personalRepresentativesScopePermissions?: PersonalRepresentativeScopePermission[]
}

type CreationAttributes = Optional<
  ModelAttributes,
  | 'enabled'
  | 'showInDiscoveryDocument'
  | 'grantToLegalGuardians'
  | 'grantToProcuringHolders'
  | 'grantToPersonalRepresentatives'
  | 'allowExplicitDelegationGrant'
  | 'automaticDelegationGrant'
  | 'alsoForDelegatedUser'
  | 'required'
  | 'emphasize'
  | 'created'
>

@Table({
  tableName: 'api_scope',
})
export class ApiScope extends Model<ModelAttributes, CreationAttributes> {
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
    type: DataType.NUMBER,
    allowNull: false,
    defaultValue: 0,
  })
  @ApiProperty({
    example: 0,
  })
  order!: number

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
  grantToPersonalRepresentatives!: boolean

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
  archived?: Date | null

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiPropertyOptional({ nullable: true })
  readonly modified?: Date | null

  @BelongsTo(() => ApiScopeGroup)
  @ApiPropertyOptional()
  group?: ApiScopeGroup

  @HasMany(() => DelegationScope)
  delegationScopes?: DelegationScope[]

  @HasMany(() => PersonalRepresentativeScopePermission)
  personalRepresentativeScopePermissions?: PersonalRepresentativeScopePermission[]

  toDTO(): ApiScopesDTO {
    return {
      name: this.name,
      enabled: this.enabled,
      displayName: this.displayName,
      description: this.description,
      order: this.order,
      showInDiscoveryDocument: this.showInDiscoveryDocument,
      grantToLegalGuardians: this.grantToLegalGuardians,
      grantToProcuringHolders: this.grantToProcuringHolders,
      grantToPersonalRepresentatives: this.grantToPersonalRepresentatives,
      allowExplicitDelegationGrant: this.allowExplicitDelegationGrant,
      automaticDelegationGrant: this.automaticDelegationGrant,
      alsoForDelegatedUser: this.alsoForDelegatedUser,
      required: this.required,
      emphasize: this.emphasize,
    }
  }
}
