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
      name: 'unique_payment_method_confirmation_ref_id',
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

  @ApiPropertyOptional()
  @ForeignKey(() => FjsCharge)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'fjs_charge_id',
  })
  fjsChargeId?: string | null

  @ApiProperty()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_deleted',
  })
  isDeleted!: CreationOptional<boolean>

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
