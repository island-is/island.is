import max from 'lodash/max'
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize'
import {
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
import { DelegationDTO } from '../dto/delegation.dto'
import { DelegationScope } from './delegation-scope.model'
import { Domain } from '../../resources/models/domain.model'
import { MergedDelegationDTO } from '../dto/merged-delegation.dto'
import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'
import { DelegationDelegationType } from './delegation-delegation-type.model'
import { isDefined } from '@island.is/shared/utils'

@Table({
  tableName: 'delegation',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['domain_name', 'from_national_id', 'to_national_id'],
    },
  ],
})
export class Delegation extends Model<
  InferAttributes<Delegation>,
  InferCreationAttributes<Delegation>
> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  id!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fromNationalId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fromDisplayName!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  toNationalId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  toName!: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  createdByNationalId?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ForeignKey(() => Domain)
  domainName?: string

  /**
   * ReferenceId is a field for storing a reference to the zendesk ticket id
   */
  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  referenceId?: string

  get validTo(): Date | null | undefined {
    if (
      this.delegationDelegationTypes &&
      this.delegationDelegationTypes.length > 0
    ) {
      const dates = this.delegationDelegationTypes
        .map((x) => x.validTo)
        .filter((x) => isDefined(x)) as Array<Date>
      return max(dates)
    }

    // 1. Find a value with null as validTo. Null means that delegation scope set valid not to a specific time period
    const withNullValue = this.delegationScopes?.find((x) => x.validTo === null)
    if (withNullValue) {
      return null
    }

    // 2. Find items with value in the array
    const dates = (this.delegationScopes
      ?.filter((x) => isDefined(x.validTo))
      .map((x) => x.validTo) || []) as Array<Date>

    // Return the max value
    return max(dates)
  }

  @CreatedAt
  readonly created!: CreationOptional<Date>

  @UpdatedAt
  readonly modified?: Date

  @HasMany(() => DelegationScope, { onDelete: 'cascade' })
  delegationScopes?: NonAttribute<DelegationScope[]>

  @HasMany(() => DelegationDelegationType, { onDelete: 'cascade' })
  delegationDelegationTypes?: DelegationDelegationType[]

  toDTO(type = AuthDelegationType.Custom): DelegationDTO {
    return {
      id: this.id,
      fromName: this.fromDisplayName,
      fromNationalId: this.fromNationalId,
      toNationalId: this.toNationalId,
      toName: this.toName,
      createdBy: this.createdByNationalId,
      validTo: this.validTo,
      scopes: this.delegationScopes
        ? this.delegationScopes.map((scope) => scope.toDTO())
        : [],
      provider: AuthDelegationProvider.Custom,
      type: type,
      referenceId: this.referenceId,
      domainName: this.domainName,
    }
  }

  toMergedDTO(types = [AuthDelegationType.Custom]): MergedDelegationDTO {
    return {
      fromName: this.fromDisplayName,
      fromNationalId: this.fromNationalId,
      toNationalId: this.toNationalId,
      toName: this.toName,
      validTo: this.validTo,
      types: types,
      scopes: this.delegationScopes
        ? this.delegationScopes.map((scope) => scope.toDTO())
        : [],
    }
  }
}
