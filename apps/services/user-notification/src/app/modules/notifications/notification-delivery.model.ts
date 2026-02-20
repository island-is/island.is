import {
  Table,
  Column,
  Model,
  DataType,
  AutoIncrement,
  PrimaryKey,
} from 'sequelize-typescript'
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'

@Table({
  tableName: 'notification_delivery',
  timestamps: false,
  indexes: [{ fields: ['message_id'] }],
})
export class NotificationDelivery extends Model<
  InferAttributes<NotificationDelivery>,
  InferCreationAttributes<NotificationDelivery>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'id',
  })
  id!: CreationOptional<number>

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'message_id',
  })
  messageId!: string

  @Column({
    type: DataType.STRING(10),
    allowNull: false,
    field: 'channel',
  })
  channel!: 'email' | 'sms' | 'push'

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'created',
  })
  created!: CreationOptional<Date>
}
