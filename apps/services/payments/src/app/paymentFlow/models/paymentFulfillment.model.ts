import { ApiProperty } from '@nestjs/swagger'
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
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { PaymentFlow } from './paymentFlow.model'
import { FjsCharge } from './fjsCharge.model'

@Table({
  tableName: 'payment_fulfillment',
  indexes: [
    {
      name: 'uniq_payment_method_confirmation_ref',
      unique: true,
      fields: ['payment_method', 'confirmation_ref_id'],
    },
  ],
})
export class PaymentFulfillment extends Model<
  InferAttributes<PaymentFulfillment>,
  InferCreationAttributes<PaymentFulfillment>
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
    unique: true, // To prevent double payments
  })
  paymentFlowId!: string

  @ApiProperty()
  @Column({
    type: DataType.ENUM('card', 'invoice'),
    allowNull: false,
    field: 'payment_method',
  })
  paymentMethod!: 'card' | 'invoice'

  @ApiProperty()
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'confirmation_ref_id',
  })
  confirmationRefId!: string

  @ApiProperty()
  @ForeignKey(() => FjsCharge)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'fjs_charge_id',
  })
  fjsChargeId?: string

  @CreatedAt
  @ApiProperty()
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'created',
  })
  created!: CreationOptional<Date>

  @UpdatedAt
  @ApiProperty()
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'modified',
  })
  modified!: CreationOptional<Date>
}

export type PaymentFulfillmentAttributes = Omit<
  InferAttributes<PaymentFulfillment>,
  'created' | 'modified' | 'id'
>
