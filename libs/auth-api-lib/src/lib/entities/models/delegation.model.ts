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
      scopes: this.delegationScopes
        ? this.delegationScopes.map((scope) => scope.toDTO())
        : [],
      provider: DelegationProvider.Custom,
      type: DelegationType.Custom,
    }
  }
}
