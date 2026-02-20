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

@Table({
  tableName: 'payment_worker_event',
  indexes: [
    {
      name: 'payment_worker_event_payment_flow_id_task_type_idx',
      fields: ['payment_flow_id', 'task_type'],
    },
    {
      name: 'payment_worker_event_flow_task_created_idx',
      fields: ['payment_flow_id', 'task_type', 'created'],
    },
  ],
})
export class PaymentWorkerEvent extends Model<
  InferAttributes<PaymentWorkerEvent>,
  InferCreationAttributes<PaymentWorkerEvent>
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
    type: DataType.STRING(64),
    allowNull: false,
    field: 'task_type',
  })
  taskType!: string

  @ApiProperty()
  @Column({
    type: DataType.ENUM('success', 'failure'),
    allowNull: false,
  })
  status!: 'success' | 'failure'

  @ApiProperty()
  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'created',
  })
  created!: CreationOptional<Date>

  @ApiPropertyOptional()
  @Column({
    type: DataType.STRING(64),
    allowNull: true,
    field: 'error_code',
  })
  errorCode?: string | null

  @ApiPropertyOptional()
  @Column({
    type: DataType.STRING(512),
    allowNull: true,
  })
  message?: string | null

  @ApiPropertyOptional({ type: Object })
  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  metadata?: object | null

  @ApiProperty()
  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'modified',
  })
  modified!: CreationOptional<Date>
}

export type PaymentWorkerEventAttributes = InferAttributes<PaymentWorkerEvent>
