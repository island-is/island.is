import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
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
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'
import { PaymentFlow } from '../../paymentFlow/models/paymentFlow.model'

@Table({
  tableName: 'bank_transfer_payment',
})
export class BankTransferPayment extends Model<
  InferAttributes<BankTransferPayment>,
  InferCreationAttributes<BankTransferPayment>
> {
  @ApiProperty()
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  id!: CreationOptional<string>

  @ApiProperty()
  @ForeignKey(() => PaymentFlow)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'payment_flow_id',
  })
  paymentFlowId!: string

  @BelongsTo(() => PaymentFlow)
  paymentFlow?: PaymentFlow

  // External provider name (e.g. 'blikk'); provider-neutral to allow swapping without a migration.
  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'provider',
  })
  provider!: string

  // Provider-side payment id; used to look the row up from a webhook.
  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'provider_payment_id',
  })
  providerPaymentId!: string

  // Per-attempt idempotency key sent to the provider on create (equal to this row's `id`).
  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'source_reference_id',
  })
  sourceReferenceId!: string

  @ApiProperty()
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'amount',
  })
  amount!: number

  // Raw provider status; stored as string for provider-neutrality.
  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'last_known_status',
  })
  lastKnownStatus!: string

  // Empty when the bank uses back-channel (push-notification) SCA.
  @ApiPropertyOptional()
  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'sca_redirect_url',
  })
  scaRedirectUrl?: string | null

  // TTL set on creation; mirrors the value sent to Blikk. Past this, the row is silent-stale.
  @ApiProperty()
  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'expires_at',
  })
  expiresAt!: Date

  @ApiProperty()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_deleted',
  })
  isDeleted!: CreationOptional<boolean>

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'created',
  })
  created!: CreationOptional<Date>

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'modified',
  })
  modified!: CreationOptional<Date>
}

export type BankTransferPaymentAttributes = InferAttributes<BankTransferPayment>
