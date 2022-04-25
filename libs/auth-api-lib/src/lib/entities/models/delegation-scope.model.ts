import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  BelongsTo,
  UpdatedAt,
  PrimaryKey,
  ForeignKey,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { Delegation } from './delegation.model'
import { DelegationScopeDTO } from '../dto/delegation-scope.dto'
import { ApiScope } from './api-scope.model'
import { IdentityResource } from './identity-resource.model'

@Table({
  tableName: 'delegation_scope',
  timestamps: false,
})
export class DelegationScope extends Model<DelegationScope> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  id!: string

  @ForeignKey(() => Delegation)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  delegationId!: string

  @ForeignKey(() => ApiScope)
  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      ddlConstraint(this: DelegationScope) {
        this.eitherScopeNameOrIdentityResourceName()
      },
    },
  })
  scopeName?: string

  @BelongsTo(() => ApiScope)
  apiScope?: any //ApiScope

  @ForeignKey(() => IdentityResource)
  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      ddlConstraint(this: DelegationScope) {
        this.eitherScopeNameOrIdentityResourceName()
      },
    },
  })
  identityResourceName?: string

  @BelongsTo(() => IdentityResource)
  identityResource?: any //IdentityResource

  @BelongsTo(() => Delegation)
  delegation!: Delegation

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  validFrom!: Date

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  validTo!: Date

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date

  toDTO(): DelegationScopeDTO {
    return {
      id: this.id,
      delegationId: this.delegationId,
      scopeName: this.scopeName ?? this.identityResourceName ?? '',
      displayName:
        (this.apiScope as ApiScope)?.displayName ??
        (this.identityResource as IdentityResource)?.displayName,
      validFrom: this.validFrom,
      validTo: this.validTo,
    }
  }

  eitherScopeNameOrIdentityResourceName() {
    if (!(this.scopeName || this.identityResourceName)) {
      return new Error(
        'Either scopeName or identityResourceName must be specified.',
      )
    }
    if (this.scopeName && this.identityResourceName) {
      return new Error(
        'ScopeName and identityResourceName can not both be specified.',
      )
    }
  }
}
