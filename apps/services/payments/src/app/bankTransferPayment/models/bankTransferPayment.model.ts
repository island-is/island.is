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
  indexes: [
    {
      name: 'bank_transfer_payment_payment_flow_id_idx',
      fields: ['payment_flow_id'],
    },
  ],
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

  /**
   * Identifies the external provider (e.g. 'blikk'). Kept provider-neutral so a
   * future provider can be swapped in without a schema change.
   */
  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'provider',
  })
  provider!: string

  /** The payment id returned by the provider; used to look the flow up from a webhook. */
  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'provider_payment_id',
  })
  providerPaymentId!: string

  /** Idempotency key sent to the provider on create (our payment flow id). */
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

  /**
   * The provider's raw status verbatim (e.g. 'PENDING', 'SUCCESS'). Stored as a
   * string rather than a provider-shaped DB enum so it stays provider-neutral and
   * does not need a migration if a provider's status vocabulary changes.
   */
  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'last_known_status',
  })
  lastKnownStatus!: string

  /** May be empty when the bank uses back-channel (push-notification) SCA. */
  @ApiPropertyOptional()
  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'sca_redirect_url',
  })
  scaRedirectUrl?: string | null

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
