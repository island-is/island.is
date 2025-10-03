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

@Table({
  tableName: 'card_payment_details',
})
export class CardPaymentDetails extends Model<
  InferAttributes<CardPaymentDetails>,
  InferCreationAttributes<CardPaymentDetails>
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
    field: 'masked_card_number',
  })
  maskedCardNumber!: string

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'acquirer_reference_number',
  })
  acquirerReferenceNumber!: string

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'authorization_code',
  })
  authorizationCode!: string

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'card_scheme',
  })
  cardScheme!: string

  @ApiProperty()
  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    field: 'total_price',
  })
  totalPrice!: number

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'card_usage',
  })
  cardUsage!: string

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'merchant_reference_data',
  })
  merchantReferenceData!: string

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

export type CardPaymentDetailsAttributes = Omit<
  InferAttributes<CardPaymentDetails>,
  'created' | 'modified' | 'id'
>
