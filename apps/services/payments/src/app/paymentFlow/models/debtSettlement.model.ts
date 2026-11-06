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

export type DebtSettlementStatus =
  | 'pending'
  | 'registered'
  | 'rejected'
  | 'needs_reconciliation'

/**
 * Settlement state of a debt payment flow: whether the captured payment has been registered
 * with FJS (`payDebt`). One row per flow, since a rejected debt flow is terminal.
 */
@Table({
  tableName: 'debt_settlement',
  // Declared here as well as in the migration because the test database is built by
  // `sequelize.sync()`. Keep both in step with the SQL.
  indexes: [
    {
      name: 'debt_settlement_payment_flow_id_unique',
      unique: true,
      fields: ['payment_flow_id'],
    },
  ],
})
export class DebtSettlement extends Model<
  InferAttributes<DebtSettlement>,
  InferCreationAttributes<DebtSettlement>
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
    type: DataType.ENUM(
      'pending',
      'registered',
      'rejected',
      'needs_reconciliation',
    ),
    allowNull: false,
    defaultValue: 'pending',
  })
  status!: CreationOptional<DebtSettlementStatus>

  @ApiProperty()
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  attempts!: CreationOptional<number>

  @ApiProperty()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'had_ambiguous_attempt',
  })
  hadAmbiguousAttempt!: CreationOptional<boolean>

  @ApiPropertyOptional()
  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'last_attempt_at',
  })
  lastAttemptAt?: Date | null

  @ApiPropertyOptional()
  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'payment_date',
  })
  paymentDate?: Date

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

  // `dateCreated` from the FJS 202 response, kept as FJS sent it
  @ApiPropertyOptional()
  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'date_created',
  })
  dateCreated?: string

  @ApiPropertyOptional({ type: Object })
  @Column({
    type: DataType.JSON,
    allowNull: true,
    field: 'last_error',
  })
  lastError?: object

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

export type DebtSettlementAttributes = InferAttributes<DebtSettlement>
