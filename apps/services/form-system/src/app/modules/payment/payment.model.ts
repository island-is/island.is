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
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Application } from '../applications/models/application.model'

@Table({ tableName: 'payment' })
export class Payment extends Model<
  InferAttributes<Payment>,
  InferCreationAttributes<Payment>
> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  id!: CreationOptional<string>

  @CreatedAt
  created!: CreationOptional<Date>

  @UpdatedAt
  modified!: CreationOptional<Date>

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  fulfilled!: CreationOptional<boolean>

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'reference_id',
  })
  referenceId?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  user4?: string

  @Column({
    type: DataType.JSONB,
    defaultValue: {},
  })
  definition!: CreationOptional<object>

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  amount!: number

  @Column({
    type: DataType.DATE,
    field: 'expires_at',
  })
  expiresAt!: Date

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'request_id',
  })
  requestId?: string

  @ForeignKey(() => Application)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'application_id',
  })
  applicationId!: string
}
