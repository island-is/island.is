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

import { Domain } from '../../resources/models/domain.model'
import { DelegationRequestDTO } from '../dto/delegation-request.dto'
import { DelegationRequestStatus } from '../types/delegationRequestStatus'
import { DelegationRequestScope } from './delegation-request-scope.model'

/**
 * A request for a delegation, initiated by the prospective delegate
 * (`toNationalId`) and addressed to a prospective grantor (`fromNationalId` —
 * an individual or a company whose procuration holders decide). It carries the
 * requester's stated relationship and reason, which are surfaced to the grantor
 * when they decide whether to grant the delegation.
 *
 * Requests are a separate concept from {@link Delegation}: approving a request
 * creates a normal delegation through the existing grant path, and the request
 * is then linked via `resolvedDelegationId` and marked `approved`.
 */
@Table({
  tableName: 'delegation_request',
  timestamps: true,
  createdAt: 'created',
  updatedAt: 'modified',
  indexes: [
    // Block more than one live (pending) request for the same
    // grantor/requester/domain triple. Enforced as a partial unique index in
    // the migration so resolved requests don't count.
    {
      name: 'delegation_request_unique_pending',
      unique: true,
      fields: ['from_national_id', 'to_national_id', 'domain_name'],
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

  /** National id of the prospective grantor (person or company). */
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fromNationalId!: string

  /** National id of the requester / prospective delegate. */
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  toNationalId!: string

  @ForeignKey(() => Domain)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  domainName?: string | null

  /** Requester's stated relationship to the grantor (tengsl). */
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  relationship!: string

  /** Requester's stated purpose for the request (tilgangur). */
  @Column({
    type: DataType.STRING,
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

  /** Requester's national id (who created the request). */
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  createdByNationalId!: string

  /** National id of the grantor/procuration holder who resolved the request. */
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  resolvedByNationalId?: string | null

  /**
   * Id of the delegation created when the request was approved. Kept as a plain
   * reference (not a DB-level FK) so the request row survives for audit even if
   * the resulting delegation is later revoked/deleted.
   */
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  resolvedDelegationId?: string | null

  /** When a still-pending request should be considered expired. */
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

  toDTO(): DelegationRequestDTO {
    return {
      id: this.id,
      fromNationalId: this.fromNationalId,
      toNationalId: this.toNationalId,
      domainName: this.domainName,
      relationship: this.relationship,
      reason: this.reason,
      status: this.status,
      createdByNationalId: this.createdByNationalId,
      resolvedByNationalId: this.resolvedByNationalId,
      resolvedDelegationId: this.resolvedDelegationId,
      expiresAt: this.expiresAt,
      createdAt: this.created,
      scopes: this.requestScopes
        ? this.requestScopes.map((scope) => scope.toDTO())
        : [],
    }
  }
}
