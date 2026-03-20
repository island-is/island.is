import {
  Table,
  Column,
  Model,
  DataType,
  AutoIncrement,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript'
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'

interface ArgItem {
  key: string
  value: string
}

@Table({
  tableName: 'user_notification', // Explicitly setting the table name
  indexes: [{ fields: ['message_id'] }, { fields: ['recipient'] }],
})
export class Notification extends Model<
  InferAttributes<Notification>,
  InferCreationAttributes<Notification>
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
    unique: true, // Adding the unique constraint
    field: 'message_id',
  })
  messageId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'recipient',
  })
  recipient!: string

  @Column({
    type: DataType.STRING,
    defaultValue: null,
    allowNull: true, // initially nullable if it's optional during transition
    field: 'sender_id',
  })
  senderId?: string
  // senderId!: CreationOptional<string>;
  // senderId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'template_id',
  })
  templateId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'scope',
  })
  scope!: string

  @Column({
    type: DataType.JSON,
    allowNull: false,
    field: 'args',
  })
  args!: ArgItem[]

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

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    field: 'read',
  })
  read!: CreationOptional<boolean>

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    field: 'seen',
  })
  seen!: CreationOptional<boolean>
}
