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
import { DelegationScope } from './delegation-scope.model'
import { DelegationDTO, DelegationProvider, DelegationType } from '../../..'

@Table({
  tableName: 'delegation',
  timestamps: false,
})
export class Delegation extends Model {
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

  get validTo(): Date | null | undefined {
    // 1. Find a value with null as validTo. Null means that delegation scope set valid not to a specific time period
    const withNullValue = this.delegationScopes?.find((x) => x.validTo === null)
    if (withNullValue) {
      return null
    }

    // 2. Find items with value in the array
    const arrDates = this.delegationScopes
      ?.filter((x) => x.validTo !== null && x.validTo !== undefined)
      .map((x) => x.validTo) as Array<Date>
    if (arrDates && arrDates.length > 0) {
      // Return the max value
      return arrDates.reduce((a, b) => {
        return a > b ? a : b
      })
    }

    return undefined
  }

  @CreatedAt
  readonly created!: Date

  @UpdatedAt
  readonly modified?: Date

  @HasMany(() => DelegationScope)
  delegationScopes?: DelegationScope[]

  toDTO(): DelegationDTO {
    return {
      id: this.id,
      fromName: this.fromDisplayName,
      fromNationalId: this.fromNationalId,
      toNationalId: this.toNationalId,
      toName: this.toName,
      validTo: this.validTo,
      scopes: this.delegationScopes
        ? this.delegationScopes.map((scope) => scope.toDTO())
        : [],
      provider: DelegationProvider.Custom,
      type: DelegationType.Custom,
    }
  }
}
