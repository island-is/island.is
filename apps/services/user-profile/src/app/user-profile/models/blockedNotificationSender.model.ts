import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'
import { UserProfile } from './userProfile.model'

/**
 * A sender the user has blocked entirely. Kept apart from category blocks in
 * BlockedNotification, so unblocking a sender restores the user's earlier
 * per-category choices.
 */
@Table({
  tableName: 'blocked_notification_senders',
  timestamps: true,
  indexes: [
    {
      fields: ['national_id', 'sender_id'],
      unique: true,
    },
  ],
})
export class BlockedNotificationSender extends Model<
  InferAttributes<BlockedNotificationSender>,
  InferCreationAttributes<BlockedNotificationSender>
> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: CreationOptional<string>

  @ForeignKey(() => UserProfile)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  nationalId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  senderId!: string

  @CreatedAt
  @ApiProperty()
  created!: CreationOptional<Date>

  @UpdatedAt
  @ApiProperty()
  modified!: CreationOptional<Date>

  @BelongsTo(() => UserProfile, {
    foreignKey: 'nationalId',
    targetKey: 'nationalId',
    as: 'userProfile',
  })
  userProfile?: UserProfile
}
