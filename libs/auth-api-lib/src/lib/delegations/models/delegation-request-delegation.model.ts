import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { Delegation } from './delegation.model'
import { DelegationRequest } from './delegation-request.model'

@Table({
  tableName: 'delegation_request_delegation',
  timestamps: true,
  createdAt: 'created',
  updatedAt: 'modified',
})
export class DelegationRequestDelegation extends Model<
  InferAttributes<DelegationRequestDelegation>,
  InferCreationAttributes<DelegationRequestDelegation>
> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  id!: CreationOptional<string>

  @ForeignKey(() => DelegationRequest)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  delegationRequestId!: string

  @BelongsTo(() => DelegationRequest)
  delegationRequest?: DelegationRequest

  @ForeignKey(() => Delegation)
  @Column({
    // delegation.id is a uuid column.
    type: DataType.UUID,
    allowNull: false,
  })
  delegationId!: string

  @BelongsTo(() => Delegation)
  delegation?: Delegation

  @CreatedAt
  readonly created!: CreationOptional<Date>

  @UpdatedAt
  readonly modified?: Date
}
