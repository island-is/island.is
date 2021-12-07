import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'

@Table({
  tableName: 'user_notifications',
  timestamps: true,
  indexes: [
    {
      fields: ['national_id'],
    },
  ],
})
export class UserNotifications extends Model<UserNotifications> {
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

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: false,
  })
  @ApiProperty()
  nationalId!: string

  @Column({
    type: DataType.STRING(4096),
  })
  @ApiProperty()
  deviceToken!: string

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  @ApiProperty()
  isEnabled!: boolean
}
