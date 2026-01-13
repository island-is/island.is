import {
  Table,
  Column,
  Model,
  DataType,
  AutoIncrement,
  PrimaryKey,
  CreatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript'
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'
import { Notification } from './notification.model'

@Table({
  tableName: 'actor_notification',
  timestamps: true,
  createdAt: 'created',
  updatedAt: false,
  indexes: [
    { fields: ['user_notification_id'] },
    { fields: ['message_id'] },
    { fields: ['recipient', 'id'] },
  ],
})
export class ActorNotification extends Model<
  InferAttributes<ActorNotification>,
  InferCreationAttributes<ActorNotification>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'id',
  })
  id!: CreationOptional<number>

  @ForeignKey(() => Notification)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'user_notification_id',
  })
  userNotificationId!: number

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'message_id',
  })
  messageId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'recipient',
  })
  recipient!: string

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created',
  })
  created!: CreationOptional<Date>

  @BelongsTo(() => Notification)
  userNotification?: Notification
}
