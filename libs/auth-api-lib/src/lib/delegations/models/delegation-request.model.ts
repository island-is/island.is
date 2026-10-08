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
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { DelegationRequestDTO } from '../dto/delegation-request.dto'
import { DelegationRequestStatus } from '../types/delegationRequestStatus'
import { DelegationRequestDelegation } from './delegation-request-delegation.model'
import { DelegationRequestScope } from './delegation-request-scope.model'

@Table({
  tableName: 'delegation_request',
  timestamps: true,
  createdAt: 'created',
  updatedAt: 'modified',
  indexes: [
    {
      name: 'delegation_request_unique_pending',
      unique: true,
      fields: ['from_national_id', 'to_national_id'],
      where: { status: DelegationRequestStatus.Pending },
    },
  ],
})
export class DelegationRequest extends Model<
  InferAttributes<DelegationRequest>,
  InferCreationAttributes<DelegationRequest>
> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  id!: CreationOptional<string>

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fromNationalId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  toNationalId!: string

  @Column({
    type: DataType.STRING(1024),
    allowNull: false,
  })
  relationship!: string

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  reason!: string

  @Column({
    type: DataType.ENUM,
    values: Object.values(DelegationRequestStatus),
    allowNull: false,
    defaultValue: DelegationRequestStatus.Pending,
  })
  status!: CreationOptional<DelegationRequestStatus>

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  createdByNationalId!: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  resolvedByNationalId?: string | null

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expiresAt!: Date

  @CreatedAt
  readonly created!: CreationOptional<Date>

  @UpdatedAt
  readonly modified?: Date

  @HasMany(() => DelegationRequestScope, { onDelete: 'cascade' })
  requestScopes?: NonAttribute<DelegationRequestScope[]>

  @HasMany(() => DelegationRequestDelegation, { onDelete: 'cascade' })
  resolvedDelegations?: NonAttribute<DelegationRequestDelegation[]>

  toDTO(): DelegationRequestDTO {
    return {
      id: this.id,
      fromNationalId: this.fromNationalId,
      toNationalId: this.toNationalId,
      relationship: this.relationship,
      reason: this.reason,
      status: this.status,
      createdByNationalId: this.createdByNationalId,
      resolvedByNationalId: this.resolvedByNationalId,
      resolvedDelegationId: this.resolvedDelegations?.[0]?.delegationId ?? null,
      expiresAt: this.expiresAt,
      createdAt: this.created,
      scopes: this.requestScopes
        ? this.requestScopes.map((scope) => scope.toDTO())
        : [],
    }
  }
}
