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
import {
  HNIPP_TEMPLATE_PRIORITY_TYPES,
  HnippTemplatePriorityType,
} from './dto/hnippTemplate.response'

/**
 * Tracks which sender templates have sent notifications to a recipient, with
 * the latest category and priority type of each template. Unlike
 * user_notification, rows here are not pruned by the cleanup job.
 */
@Table({
  tableName: 'user_notification_sender',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['recipient', 'sender_id', 'template_id'] },
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

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'template_id',
  })
  templateId!: string

  /**
   * Slugified Icelandic HnippCategory, null when the template has no category,
   * which is presented as 'almennt'. Updated on every send, since a template's
   * category can change.
   */
  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'category',
  })
  category!: string | null

  /**
   * Latest priority type of the template, updated on every send.
   */
  @Column({
    type: DataType.ENUM(...HNIPP_TEMPLATE_PRIORITY_TYPES),
    allowNull: true,
    field: 'priority_type',
  })
  priorityType!: HnippTemplatePriorityType | null
}
