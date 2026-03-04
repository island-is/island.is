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

export enum NotificationChannel {
  Email = 'email',
  Sms = 'sms',
  Push = 'push',
}

@Table({
  tableName: 'notification_delivery',
  timestamps: false,
  indexes: [{ fields: ['user_notification_id'] }],
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
    type: DataType.INTEGER,
    allowNull: false,
    field: 'user_notification_id',
  })
  userNotificationId!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'actor_notification_id',
  })
  actorNotificationId!: CreationOptional<number | null>

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'sent_to',
  })
  sentTo!: string

  @Column({
    type: DataType.ENUM(...Object.values(NotificationChannel)),
    allowNull: false,
    field: 'channel',
  })
  channel!: NotificationChannel

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'created',
  })
  created!: CreationOptional<Date>
}
