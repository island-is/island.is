import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
} from 'sequelize-typescript'
import { InferAttributes, InferCreationAttributes } from 'sequelize'

export interface CategoryLabel {
  is: string
  en?: string
}

/**
 * The latest label of each category in user_notification_sender, kept apart
 * so the label is stored once per category instead of once per recipient.
 */
@Table({
  tableName: 'notification_category',
  timestamps: false,
})
export class NotificationCategory extends Model<
  InferAttributes<NotificationCategory>,
  InferCreationAttributes<NotificationCategory>
> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'category',
  })
  category!: string

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    field: 'label',
  })
  label!: CategoryLabel
}
