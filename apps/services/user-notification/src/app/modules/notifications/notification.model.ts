import { Table, Column, Model, DataType, AutoIncrement, PrimaryKey, CreatedAt, UpdatedAt, Index } from 'sequelize-typescript';

interface ArgItem {
  key: string;
  value: string;
}

enum NotificationStatus {
  READ = 'read',
  UNREAD = 'unread'
}
@Table({
  tableName: 'user_notification', // Explicitly setting the table name
})
@Table
export class Notification extends Model<Notification> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'id'
  })
  id!: number;

  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    field: 'message_id'
  })
  messageId!: string;

  @Index // Adding an index
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'recipient'
  })
  recipient!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'template_id'
  })
  templateId!: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    field: 'args'
  })
  args!: ArgItem[];

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created'
  })
  created!: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated'
  })
  updated!: Date;

  @Column({
    type: DataType.ENUM,
    values: [NotificationStatus.READ, NotificationStatus.UNREAD],
    defaultValue: NotificationStatus.UNREAD,
    allowNull: false,
    field: 'status'
  })
  status!: NotificationStatus;

  
}
