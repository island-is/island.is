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
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { Delegation } from '../../delegations/models/delegation.model'
import { Domain } from '../../resources/models/domain.model'
import type {
  ConfirmationContentSnapshot,
  ConfirmationScope,
} from '../types/delegation-confirmation-content'
import { DelegationConfirmationStatus } from '../types/delegation-confirmation-status'

/** Confirmed rows are evidence: never updated or deleted, and they outlive the delegation. */
@Table({
  tableName: 'delegation_confirmation',
  timestamps: true,
  createdAt: 'created',
  updatedAt: 'modified',
})
export class DelegationConfirmation extends Model<
  InferAttributes<DelegationConfirmation>,
  InferCreationAttributes<DelegationConfirmation>
> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  id!: CreationOptional<string>

  @ForeignKey(() => Delegation)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  delegationId?: string | null

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  groupId?: string | null

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fromNationalId!: string

  /** Set for a company grant: the procuration holder, the only one who may confirm it. */
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  actorNationalId?: string | null

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

  @Column({
    type: DataType.ENUM(...Object.values(DelegationConfirmationStatus)),
    allowNull: false,
    defaultValue: DelegationConfirmationStatus.Pending,
  })
  status!: CreationOptional<DelegationConfirmationStatus>

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  contentSnapshot!: ConfirmationContentSnapshot

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  contentHash!: string

  /** Recorded so old hashes stay verifiable if the algorithm changes. */
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  contentHashAlg!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  requestedAcr!: string

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expiresAt!: Date

  @Column({ type: DataType.DATE })
  confirmedAt?: Date | null

  @Column({ type: DataType.STRING })
  confirmingNationalId?: string | null

  @Column({ type: DataType.STRING })
  acr?: string | null

  @Column({ type: DataType.JSONB })
  amr?: string[] | null

  @Column({ type: DataType.DATE })
  authTime?: Date | null

  @Column({ type: DataType.STRING })
  confirmedSub?: string | null

  @Column({ type: DataType.STRING })
  confirmedSid?: string | null

  @Column({ type: DataType.STRING })
  confirmedClientId?: string | null

  @Column({ type: DataType.STRING })
  confirmedIp?: string | null

  @Column({ type: DataType.STRING })
  confirmedUserAgent?: string | null

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  receiptIssuer!: string

  /** Read from the snapshot, which is what contentHash covers. */
  get scopes(): NonAttribute<ConfirmationScope[]> {
    return this.contentSnapshot?.scopes ?? []
  }

  @Column({ type: DataType.STRING })
  authReqId?: string | null

  @Column({ type: DataType.STRING })
  authMethod?: string | null

  @Column({ type: DataType.DATE })
  authStartedAt?: Date | null

  @Column({ type: DataType.STRING })
  certificateThumbprint?: string | null

  @CreatedAt
  created!: CreationOptional<Date>

  @UpdatedAt
  modified?: Date
}
