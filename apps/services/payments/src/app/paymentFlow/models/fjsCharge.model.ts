import { ApiProperty } from '@nestjs/swagger'
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
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'

@Table({
  tableName: 'fjs_charge',
  indexes: [
    {
      name: 'fjs_charge_payment_flow_id_idx',
      fields: ['payment_flow_id'],
    },
  ],
})
export class FjsCharge extends Model<
  InferAttributes<FjsCharge>,
  InferCreationAttributes<FjsCharge>
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
    field: 'user4',
  })
  user4!: string

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'reception_id',
  })
  receptionId!: string

  @ApiProperty()
  @Column({
    type: DataType.ENUM(
      'unpaid',
      'paid',
      'cancelled',
      'recreated',
      'recreatedAndPaid',
    ),
    allowNull: false,
    defaultValue: 'unpaid',
    field: 'status',
  })
  status!: CreationOptional<
    'unpaid' | 'paid' | 'cancelled' | 'recreated' | 'recreatedAndPaid'
  >

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

export type FjsChargeAttributes = InferAttributes<FjsCharge>
