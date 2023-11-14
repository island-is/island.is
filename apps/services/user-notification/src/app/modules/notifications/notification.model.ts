// notification.model.ts

import {
  Table,
  Model,
  Column,
  DataType,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript'

export enum NotificationState {
  READ = 'read',
  UNREAD = 'unread',
}

// @Table({
//   tableName: 'user_profile',
//   timestamps: true,
//   indexes: [
//     {
//       fields: ['national_id'],................................
//     },
//   ],
// })

@Table
export class Notification extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number

  @Column(DataType.STRING)
  nationalId!: string

  @Column(DataType.STRING)
  templateId!: string

  @Column(DataType.JSON)
  args!: Array<{
    key: string
    value: string
  }>

  @Column(DataType.JSON)
  compiled!: {
    title: string
    body: string
    click_action: string
  }

  @CreatedAt
  created!: Date

  @UpdatedAt
  modified!: Date

  @Column({
    type: DataType.ENUM(NotificationState.READ, NotificationState.UNREAD),
    defaultValue: NotificationState.UNREAD,
  })
  state!: NotificationState
}
