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
  tableName: 'user_device_tokens',
  timestamps: true,
  indexes: [
    {
      fields: ['national_id'],
    },
  ],
})
export class UserDeviceTokens extends Model<UserDeviceTokens> {
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
    unique: true,
  })
  @ApiProperty()
  deviceToken!: string
}
