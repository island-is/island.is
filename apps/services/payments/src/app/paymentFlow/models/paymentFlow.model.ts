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
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

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

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'product_id',
  })
  productId!: string

  @ApiPropertyOptional()
  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'invoice_id',
  })
  invoiceId?: string

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
    allowNull: false,
    field: 'on_success_url',
  })
  onSuccessUrl!: string

  @ApiPropertyOptional()
  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'on_update_url',
  })
  onUpdateUrl?: string

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'on_error_url',
  })
  onErrorUrl!: string

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
