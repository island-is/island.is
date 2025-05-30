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
  tableName: 'email_verification',
  timestamps: true,
  indexes: [
    {
      fields: ['national_id'],
    },
  ],
})
export class EmailVerification extends Model<
  InferAttributes<EmailVerification>,
  InferCreationAttributes<EmailVerification>
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
    type: DataType.BOOLEAN,
  })
  @ApiProperty()
  confirmed!: CreationOptional<boolean>

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
