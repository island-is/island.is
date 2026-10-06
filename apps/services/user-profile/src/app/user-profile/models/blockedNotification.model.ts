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

@Table({
  tableName: 'blocked_notifications',
  timestamps: true,
  indexes: [
    {
      fields: ['national_id', 'sender_id'],
      unique: true,
    },
  ],
})
export class BlockedNotification extends Model<
  InferAttributes<BlockedNotification>,
  InferCreationAttributes<BlockedNotification>
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
