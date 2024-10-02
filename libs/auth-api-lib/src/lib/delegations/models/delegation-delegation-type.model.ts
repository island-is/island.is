import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'
import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
} from 'sequelize-typescript'

import { Delegation } from './delegation.model'
import { DelegationTypeModel } from './delegation-type.model'

@Table({
  tableName: 'delegation_delegation_type',
  timestamps: false,
  indexes: [
    {
      fields: ['delegation_id', 'delegation_type_id'],
      unique: true,
    },
  ],
})
export class DelegationDelegationType extends Model<
  InferAttributes<DelegationDelegationType>,
  InferCreationAttributes<DelegationDelegationType>
> {
  @ForeignKey(() => Delegation)
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  delegationId!: string

  @ForeignKey(() => DelegationTypeModel)
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  delegationTypeId!: string

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  validTo?: Date | null

  @CreatedAt
  readonly created!: CreationOptional<Date>

  @UpdatedAt
  readonly modified?: Date

  @BelongsTo(() => Delegation)
  delegation?: Delegation

  @BelongsTo(() => DelegationTypeModel)
  delegationType?: DelegationTypeModel
}
