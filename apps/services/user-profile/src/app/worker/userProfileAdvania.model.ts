import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'

import { ProcessedStatus } from './types'

@Table({
  tableName: 'user_profile_advania',
  timestamps: true,
  indexes: [
    {
      fields: ['ssn'],
    },
  ],
})
export class UserProfileAdvania extends Model {
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
    primaryKey: true,
  })
  @ApiProperty()
  ssn!: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  email?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  mobilePhoneNumber?: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiProperty()
  canNudge?: boolean

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  nudgeLastAsked?: Date

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  exported?: Date

  @Column({
    type: DataType.ENUM('PENDING', 'DONE', 'ERROR'),
    defaultValue: 'PENDING',
  })
  @ApiProperty({
    description: 'Indicates processed status',
    enum: ProcessedStatus,
  })
  status?: ProcessedStatus
}
