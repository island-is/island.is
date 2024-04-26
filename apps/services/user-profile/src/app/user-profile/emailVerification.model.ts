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
  tableName: 'email_verification',
  timestamps: true,
  indexes: [
    {
      fields: ['national_id'],
    },
  ],
})
export class EmailVerification extends Model<EmailVerification> {
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
    unique: true,
  })
  @ApiProperty()
  nationalId!: string

  @Column({
    type: DataType.BOOLEAN,
  })
  @ApiProperty()
  confirmed!: boolean

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  hash!: string

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  email!: string

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    allowNull: false,
  })
  tries!: number
}
