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
import { ActorProfile } from './actor-profile.model'

/**
 * A sender blocked entirely for an actor profile (delegation). Kept apart from
 * category blocks in ActorBlockedNotification, so unblocking a sender restores
 * the earlier per-category choices.
 */
@Table({
  tableName: 'actor_blocked_notification_senders',
  timestamps: true,
  indexes: [
    {
      fields: ['actor_profile_id', 'sender_id'],
      unique: true,
    },
  ],
})
export class ActorBlockedNotificationSender extends Model<
  InferAttributes<ActorBlockedNotificationSender>,
  InferCreationAttributes<ActorBlockedNotificationSender>
> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: CreationOptional<string>

  @ForeignKey(() => ActorProfile)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty()
  actorProfileId!: string

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

  @BelongsTo(() => ActorProfile, {
    foreignKey: 'actorProfileId',
    targetKey: 'id',
    as: 'actorProfile',
  })
  actorProfile?: ActorProfile
}
