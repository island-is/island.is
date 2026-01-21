import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Optional } from 'sequelize'
import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { DelegationScope } from '../../delegations/models/delegation-scope.model'
import { PersonalRepresentativeScopePermission } from '../../personal-representative/models/personal-representative-scope-permission.model'
import { ApiScopeDTO } from '../dto/api-scope.dto'
import { ApiScopeGroup } from './api-scope-group.model'
import { ApiScopeUserAccess } from './api-scope-user-access.model'
import { ApiScopeUserClaim } from './api-scope-user-claim.model'
import { Domain } from './domain.model'
import { ApiScopeDelegationType } from './api-scope-delegation-type.model'
import { DelegationTypeModel } from '../../delegations/models/delegation-type.model'
import { ApiScopeCategory } from './api-scope-category.model'
import { ApiScopeTag } from './api-scope-tag.model'

interface ModelAttributes {
  name: string
  enabled: boolean
  displayName: string
  description: string
  domainName: string
  groupId?: string | null
  showInDiscoveryDocument: boolean
  grantToAuthenticatedUser: boolean
  grantToLegalGuardians: boolean
  grantToProcuringHolders: boolean
  grantToPersonalRepresentatives: boolean
  allowExplicitDelegationGrant: boolean
  automaticDelegationGrant: boolean
  alsoForDelegatedUser: boolean
  isAccessControlled?: boolean
  userClaims?: ApiScopeUserClaim[]
  order: number
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
  | 'grantToAuthenticatedUser'
  | 'grantToLegalGuardians'
  | 'grantToProcuringHolders'
  | 'grantToPersonalRepresentatives'
  | 'allowExplicitDelegationGrant'
  | 'automaticDelegationGrant'
  | 'alsoForDelegatedUser'
  | 'order'
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
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({ example: '@island.is' })
  @ForeignKey(() => Domain)
  domainName!: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 999,
    },
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
    defaultValue: true,
  })
  @ApiProperty()
  grantToAuthenticatedUser!: boolean

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
    defaultValue: false,
  })
  @ApiPropertyOptional({ nullable: true })
  isAccessControlled?: boolean | null

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Whether this scope allows write access (read is always implicit)',
  })
  @ApiProperty()
  allowsWrite!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment:
      'Whether this scope requires step-up authentication (tvöfalt samþykki) for sensitive information access',
  })
  @ApiProperty()
  requiresConfirmation!: boolean

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
  @ApiPropertyOptional({ type: () => ApiScopeGroup })
  group?: ApiScopeGroup

  @HasMany(() => DelegationScope)
  delegationScopes?: DelegationScope[]

  @HasMany(() => PersonalRepresentativeScopePermission)
  personalRepresentativeScopePermissions?: PersonalRepresentativeScopePermission[]

  @HasMany(() => ApiScopeUserAccess)
  apiScopeUserAccesses?: ApiScopeUserAccess[]

  @HasMany(() => ApiScopeDelegationType)
  supportedDelegationTypes?: ApiScopeDelegationType[]

  @HasMany(() => ApiScopeCategory)
  categories?: ApiScopeCategory[]

  @HasMany(() => ApiScopeTag)
  tags?: ApiScopeTag[]

  @BelongsTo(() => Domain)
  @ApiPropertyOptional({ type: () => Domain })
  domain?: Domain

  @BelongsToMany(() => DelegationTypeModel, () => ApiScopeDelegationType)
  delegationTypes?: Array<
    DelegationTypeModel & { ApiScopeDelegationType: ApiScopeDelegationType }
  >

  toDTO(): ApiScopeDTO {
    return {
      name: this.name,
      enabled: this.enabled,
      displayName: this.displayName,
      description: this.description,
      order: this.order,
      showInDiscoveryDocument: this.showInDiscoveryDocument,
      grantToAuthenticatedUser: this.grantToAuthenticatedUser,
      grantToLegalGuardians: this.grantToLegalGuardians,
      grantToProcuringHolders: this.grantToProcuringHolders,
      grantToPersonalRepresentatives: this.grantToPersonalRepresentatives,
      allowExplicitDelegationGrant: this.allowExplicitDelegationGrant,
      automaticDelegationGrant: this.automaticDelegationGrant,
      alsoForDelegatedUser: this.alsoForDelegatedUser,
      required: this.required,
      emphasize: this.emphasize,
      domainName: this.domainName,
      isAccessControlled: this.isAccessControlled ?? undefined,
      allowsWrite: this.allowsWrite,
      requiresConfirmation: this.requiresConfirmation,
      supportedDelegationTypes:
        this.supportedDelegationTypes?.map(
          ({ delegationType }) => delegationType,
        ) ?? [],
      categoryIds: this.categories?.map((c) => c.categoryId) ?? [],
      tagIds: this.tags?.map((t) => t.tagId) ?? [],
    }
  }
}
