import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
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

import { DelegationConfirmation } from '../../delegation-confirmation/models/delegation-confirmation.model'
import { DelegationRequest } from './delegation-request.model'

@Table({
  tableName: 'delegation_request_confirmation',
  timestamps: true,
  createdAt: 'created',
  updatedAt: 'modified',
})
export class DelegationRequestConfirmation extends Model<
  InferAttributes<DelegationRequestConfirmation>,
  InferCreationAttributes<DelegationRequestConfirmation>
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
  delegationRequest?: NonAttribute<DelegationRequest>

  @ForeignKey(() => DelegationConfirmation)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  delegationConfirmationId!: string

  @BelongsTo(() => DelegationConfirmation)
  delegationConfirmation?: NonAttribute<DelegationConfirmation>

  @CreatedAt
  readonly created!: CreationOptional<Date>

  @UpdatedAt
  readonly modified?: Date
}
