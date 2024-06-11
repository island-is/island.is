import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'

@Table({
  tableName: 'sms_verification',
  timestamps: true,
  indexes: [
    {
      fields: ['national_id'],
    },
  ],
})
export class SmsVerification extends Model<
  InferAttributes<SmsVerification>,
  InferCreationAttributes<SmsVerification>
> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: CreationOptional<string>

  @CreatedAt
  @ApiProperty()
  created!: CreationOptional<Date>

  @UpdatedAt
  @ApiProperty()
  modified!: CreationOptional<Date>

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  @ApiProperty()
  nationalId!: string

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  smsCode!: string

  @Column({
    type: DataType.BOOLEAN,
  })
  @ApiProperty()
  confirmed!: CreationOptional<boolean>

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  mobilePhoneNumber!: string

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    allowNull: false,
  })
  tries!: number
}
