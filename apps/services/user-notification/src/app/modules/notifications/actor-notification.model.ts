import {
  Table,
  Column,
  Model,
  DataType,
  AutoIncrement,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
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
  indexes: [
    { fields: ['user_notification_id'] },
    { fields: ['message_id'] },
    { fields: ['recipient'] },
    { fields: ['onBehalfOfNationalId'] },
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
    type: DataType.UUID,
    allowNull: true,
    field: 'root_message_id',
  })
  rootMessageId?: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'recipient',
  })
  recipient!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'on_behalf_of_national_id',
  })
  onBehalfOfNationalId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'scope',
  })
  scope!: string

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created',
  })
  created!: CreationOptional<Date>

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated',
  })
  updated!: CreationOptional<Date>

  @BelongsTo(() => Notification)
  userNotification?: Notification
}
