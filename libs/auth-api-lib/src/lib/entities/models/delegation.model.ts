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
export class Delegation extends Model<Delegation> {
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
    // 1. Find a value with null as valid to. Means that delegation scope set valid and not to a specific time period
    const withNullValue = this.delegationScopes?.find((x) => x.validTo === null)
    if (withNullValue) {
      return null
    }

    // 2. Find the max value
    try {
      // Find items with value in the array
      const arrDates = this.delegationScopes
        ?.filter((x) => x.validTo !== null && x.validTo !== undefined)
        .map((x) => x.validTo)
      if (arrDates) {
        // If it's one item return it
        if (arrDates.length === 1) {
          return arrDates[0]
        }

        // Return the max value
        return arrDates.reduce((a, b) => {
          if (a !== null && a !== undefined && b !== null && b !== undefined) {
            return a > b ? a : b
          }
        })
      }
    } catch {
      // The array was empty. Nothing found
      return undefined
    }
    // Nothing found
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
