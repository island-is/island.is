import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'
import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { PaymentFlowFjsChargeConfirmation } from './paymentFlowFjsChargeConfirmation.model'

@Table({
  tableName: 'payment_flow_charge',
  indexes: [
    {
      name: 'payment_flow_charge_payment_flow_id_idx',
      fields: ['payment_flow_id'],
    },
  ],
})
export class PaymentFlowCharge extends Model<
  InferAttributes<PaymentFlowCharge>,
  InferCreationAttributes<PaymentFlowCharge>
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

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'charge_type',
  })
  chargeType!: string

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'charge_item_code',
  })
  chargeItemCode!: string

  @ApiProperty()
  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  price?: number

  @ApiProperty()
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity!: number

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  created!: CreationOptional<Date>

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  modified!: CreationOptional<Date>
}

@Table({
  tableName: 'payment_flow',
})
export class PaymentFlow extends Model<
  InferAttributes<PaymentFlow>,
  InferCreationAttributes<PaymentFlow>
> {
  @ApiProperty()
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  id!: CreationOptional<string>

  @ApiPropertyOptional()
  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'product_title',
  })
  productTitle?: string

  @ApiPropertyOptional()
  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'invoice_id',
  })
  existingInvoiceId?: string

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'payer_national_id',
  })
  payerNationalId!: string

  @ApiProperty({ type: [PaymentFlowCharge] }) // Link to the charges model
  @HasMany(() => PaymentFlowCharge, 'paymentFlowId')
  charges!: PaymentFlowCharge[]

  @HasOne(() => PaymentFlowFjsChargeConfirmation, 'paymentFlowId')
  fjsChargeConfirmation?: PaymentFlowFjsChargeConfirmation

  @ApiProperty({ type: [String] })
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    field: 'available_payment_methods',
  })
  availablePaymentMethods!: string[]

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'on_update_url',
  })
  onUpdateUrl!: string

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'organisation_id',
  })
  organisationId!: string

  @ApiPropertyOptional({ type: Object })
  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  metadata?: object

  @ApiPropertyOptional()
  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'return_url',
  })
  returnUrl?: string

  @ApiPropertyOptional()
  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'cancel_url',
  })
  cancelUrl?: string

  @ApiPropertyOptional()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    field: 'redirect_to_return_url_on_success',
  })
  redirectToReturnUrlOnSuccess?: boolean

  @ApiPropertyOptional({
    description:
      'Define key-value pairs of extra data, e.g., car license plate, house address, etc.',
    type: () => [
      {
        name: 'string',
        value: 'string',
      },
    ],
  })
  @Column({
    type: DataType.JSON,
    allowNull: true,
    field: 'extra_data',
  })
  extraData?: { name: string; value: string }[]

  @ApiPropertyOptional()
  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'charge_item_subject_id',
  })
  chargeItemSubjectId?: string

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'created',
  })
  created!: CreationOptional<Date>

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'modified',
  })
  modified!: CreationOptional<Date>
}

export type PaymentFlowAttributes = InferAttributes<PaymentFlow>
export type PaymentFlowChargeAttributes = InferAttributes<PaymentFlowCharge>
