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
import { CategoryLabel } from './blockedNotification.model'

@Table({
  tableName: 'actor_blocked_notifications',
  timestamps: true,
  indexes: [
    {
      fields: ['actor_profile_id', 'sender_id', 'category'],
      unique: true,
    },
  ],
})
export class ActorBlockedNotification extends Model<
  InferAttributes<ActorBlockedNotification>,
  InferCreationAttributes<ActorBlockedNotification>
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

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  category!: string

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  @ApiProperty()
  categoryLabel!: CategoryLabel

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
