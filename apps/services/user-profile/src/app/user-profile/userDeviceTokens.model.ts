import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript'

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
  id!: string

  @CreatedAt
  created!: Date

  @UpdatedAt
  modified!: Date

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: false,
  })
  nationalId!: string

  @Column({
    type: DataType.STRING(4096),
    unique: true,
  })
  deviceToken!: string
}
