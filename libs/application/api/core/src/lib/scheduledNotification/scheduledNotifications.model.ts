import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { Application } from '@island.is/application/api/core'

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  CANCELED = 'CANCELED',
  FAILED = 'FAILED',
}

@Table({
  tableName: 'scheduled_notification',
  timestamps: true,
  freezeTableName: true,
  indexes: [
    {
      name: 'scheduled_notification_pending_schedule_time_idx',
      fields: ['schedule_time'],
      where: {
        schedule_status: NotificationStatus.PENDING,
      },
    },
    {
      name: 'scheduled_notification_pending_app_idx',
      fields: ['application_id'],
      where: {
        schedule_status: NotificationStatus.PENDING,
      },
    },
  ],
})
export class ScheduledNotification extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @CreatedAt
  @ApiProperty()
  created!: Date

  @UpdatedAt
  @ApiProperty()
  modified!: Date

  @ApiProperty()
  @ForeignKey(() => Application)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  application_id!: Application['id']

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  template!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  application_state!: string

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @ApiProperty()
  schedule_time!: Date

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(NotificationStatus),
    defaultValue: NotificationStatus.PENDING,
  })
  @ApiProperty({ enum: NotificationStatus })
  schedule_status!: NotificationStatus
}
