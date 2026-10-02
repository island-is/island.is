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
  tableName: 'notification_sender_setting',
  timestamps: true,
  indexes: [
    {
      fields: ['national_id', 'sender_id'],
      unique: true,
    },
  ],
})
export class NotificationSenderSetting extends Model<
  InferAttributes<NotificationSenderSetting>,
  InferCreationAttributes<NotificationSenderSetting>
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

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  })
  @ApiProperty()
  enabled!: CreationOptional<boolean>

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  @ApiProperty()
  seen!: CreationOptional<boolean>

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
