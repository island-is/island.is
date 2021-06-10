import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
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
    primaryKey: true,
    allowNull: true,
    validate: {
      oneButNotBoth() {
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
      },
    },
  })
  scopeName?: string

  @ForeignKey(() => IdentityResource)
  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      oneButNotBoth() {
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
      },
    },
  })
  identityResourceName?: string

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  validFrom!: Date

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  validTo?: Date

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
      scopeName: this.scopeName,
      identityResourceName: this.identityResourceName,
      validFrom: this.validFrom,
      validTo: this.validTo,
    }
  }

  oneButNotBoth() {
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
