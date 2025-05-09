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
import { PaymentFlow } from './paymentFlow.model' // Update the import path as needed

@Table({
  tableName: 'payment_flow_event',
})
export class PaymentFlowEvent extends Model<
  InferAttributes<PaymentFlowEvent>,
  InferCreationAttributes<PaymentFlowEvent>
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
    type: DataType.ENUM('update', 'success', 'failure', 'deleted'),
    allowNull: false,
  })
  type!: 'update' | 'success' | 'failure' | 'deleted'

  @ApiProperty()
  @Column({
    type: DataType.ENUM(
      'payment_started',
      'payment_completed',
      'payment_failed',
      'deleted_admin',
      'deleted_auto',
      'other',
    ),
    allowNull: false,
  })
  reason!:
    | 'payment_started'
    | 'payment_completed'
    | 'payment_failed'
    | 'deleted_admin'
    | 'deleted_auto'
    | 'other' // further explained in message

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  paymentMethod!: string

  @ApiProperty()
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'occurred_at',
  })
  occurredAt!: Date

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  message!: string

  @ApiPropertyOptional({ type: Object })
  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  metadata?: object

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
