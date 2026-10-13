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
 * Tracks which sender categories have sent notifications to a recipient.
 * Unlike user_notification, rows here are not pruned by the cleanup job.
 */
@Table({
  tableName: 'user_notification_sender',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['recipient', 'sender_id', 'category'] },
    // Unique indexes treat nulls as distinct, so uncategorized rows need
    // their own partial index
    {
      name: 'user_notification_sender_recipient_sender_id_uncategorized_idx',
      unique: true,
      fields: ['recipient', 'sender_id'],
      where: { category: null },
    },
  ],
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

  /**
   * Slugified Icelandic HnippCategory, null when the template has no category,
   * which is presented as 'almennt'.
   */
  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'category',
  })
  category!: string | null
}
