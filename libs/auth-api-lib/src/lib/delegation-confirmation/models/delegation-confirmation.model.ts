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

/**
 * A request for a second, high-assurance confirmation of a delegation over one
 * or more sensitive scopes, and — once redeemed — the evidence record of that
 * confirmation.
 *
 * Two properties of this table are load bearing:
 *
 * 1. The pending scopes live here and are NOT written to `delegation_scope`
 *    until the confirmation is redeemed. That is what makes an unconfirmed
 *    sensitive scope unusable by construction rather than by remembering to
 *    filter it out of every read path.
 * 2. A `confirmed` row is append-only evidence. It is never updated and never
 *    deleted, and it deliberately denormalises the parties and the grant so it
 *    still stands alone after the delegation is gone.
 */
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

  /**
   * Shared by the confirmations one grant made — several recipients, or
   * several domains — so that one authentication confirms them all. Null for
   * a confirmation on its own.
   */
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  groupId?: string | null

  /** The grantor: a person, or a company for procuration grants. */
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fromNationalId!: string

  /**
   * Null for personal grants. For a company grant, the procuration holder who
   * initiated it — and the only person permitted to redeem it.
   */
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

  /** Digest over the canonicalised content snapshot. */
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  contentHash!: string

  /**
   * The digest algorithm used for `contentHash`. Recorded explicitly: a bare
   * hash with no algorithm is unverifiable once the default changes.
   */
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  contentHashAlg!: string

  /** The assurance level demanded of the confirming authentication. */
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

  /** The national ID that actually completed the authentication. */
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

  /** Join key into the identity server's own session log. */
  @Column({ type: DataType.STRING })
  confirmedSid?: string | null

  @Column({ type: DataType.STRING })
  confirmedClientId?: string | null

  @Column({ type: DataType.STRING })
  confirmedIp?: string | null

  @Column({ type: DataType.STRING })
  confirmedUserAgent?: string | null

  /**
   * The identity provider whose authentication this record rests on. Part of the
   * evidence: it says *who* attested the login, which matters once there is more
   * than one issuer or an issuer is retired.
   */
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  receiptIssuer!: string

  /**
   * The held scopes, read from the content snapshot rather than stored twice.
   * The snapshot is what the grantor was shown and what `contentHash` covers, so
   * it is the single source of truth for what is being confirmed.
   */
  get scopes(): NonAttribute<ConfirmationScope[]> {
    return this.contentSnapshot?.scopes ?? []
  }

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  attemptCount!: CreationOptional<number>

  /**
   * The identity server's handle for the step-up in progress (CIBA
   * auth_req_id). Only usable together with delegation-api's client secret, and
   * cleared once the step-up ends.
   */
  @Column({ type: DataType.STRING })
  authReqId?: string | null

  /** Which Auðkenni method the step-up in progress uses: app or sim. */
  @Column({ type: DataType.STRING })
  authMethod?: string | null

  /**
   * When the step-up in progress was started. The confirming authentication must
   * not be older than this.
   */
  @Column({ type: DataType.DATE })
  authStartedAt?: Date | null

  /** How many step-ups have been started for this confirmation. */
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  authStartCount!: CreationOptional<number>

  /** SHA-256 fingerprint of the citizen certificate behind the confirmation. */
  @Column({ type: DataType.STRING })
  certificateThumbprint?: string | null

  @CreatedAt
  created!: CreationOptional<Date>

  @UpdatedAt
  modified?: Date
}
