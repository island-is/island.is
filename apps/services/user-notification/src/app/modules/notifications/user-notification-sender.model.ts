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

/**
 * Tracks which senders have sent notifications to a recipient. Unlike
 * user_notification, rows here are not pruned by the cleanup job.
 */
@Table({
  tableName: 'user_notification_sender',
  timestamps: false,
  indexes: [{ unique: true, fields: ['recipient', 'sender_id'] }],
})
export class UserNotificationSender extends Model<
  InferAttributes<UserNotificationSender>,
  InferCreationAttributes<UserNotificationSender>
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
    type: DataType.STRING,
    allowNull: false,
    field: 'recipient',
  })
  recipient!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'sender_id',
  })
  senderId!: string
}
