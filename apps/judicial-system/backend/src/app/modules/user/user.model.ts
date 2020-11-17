import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

import { UserRole } from '@island.is/judicial-system/types'

@Table({
  tableName: 'user',
  timestamps: true,
})
export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id: string

  @CreatedAt
  @ApiProperty()
  created: Date

  @UpdatedAt
  @ApiProperty()
  modified: Date

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  @ApiProperty()
  nationalId: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  name: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  title: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  mobileNumber: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  email: string

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(UserRole),
  })
  @ApiProperty({ enum: UserRole })
  role: UserRole

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty()
  active: boolean
}
