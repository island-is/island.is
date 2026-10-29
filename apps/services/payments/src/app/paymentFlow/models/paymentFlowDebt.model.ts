import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'
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
import { PaymentFlow } from './paymentFlow.model'

@Table({
  tableName: 'payment_flow_debt',
  // Declared here as well as in the migration because the test database is built by
  // `sequelize.sync()`. Keep both in step with the SQL.
  indexes: [
    {
      name: 'payment_flow_debt_payment_flow_id_pay_id_unique',
      unique: true,
      fields: ['payment_flow_id', 'pay_id'],
    },
  ],
})
export class PaymentFlowDebt extends Model<
  InferAttributes<PaymentFlowDebt>,
  InferCreationAttributes<PaymentFlowDebt>
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

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'pay_id',
  })
  payId!: string

  // BIGINT is returned as a string by the driver, amounts are int64 on the FJS side
  @ApiProperty()
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    get() {
      return Number(this.getDataValue('amount'))
    },
  })
  amount!: number

  @ApiPropertyOptional()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  label?: string

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

export type PaymentFlowDebtAttributes = InferAttributes<PaymentFlowDebt>
