import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Locale } from './types/localeTypes'

@Table({
  tableName: 'user_profile',
  timestamps: true,
  indexes: [
    {
      fields: ['national_id'],
    },
  ],
})
export class UserProfile extends Model {
  // Force rebuild of schemas
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
    type: DataType.STRING,
  })
  @ApiPropertyOptional()
  mobilePhoneNumber?: string

  @Column({
    type: DataType.ENUM('en', 'is'),
  })
  @ApiPropertyOptional({
    description: 'User selected locale',
    enum: Locale,
  })
  locale?: Locale

  @Column({
    type: DataType.STRING,
  })
  @ApiPropertyOptional()
  email?: string

  @Column({
    type: DataType.BOOLEAN,
  })
  @ApiPropertyOptional()
  emailVerified?: boolean

  @Column({
    type: DataType.BOOLEAN,
  })
  @ApiPropertyOptional()
  mobilePhoneNumberVerified?: boolean

  @Column({
    type: DataType.STRING,
  })
  @ApiPropertyOptional()
  profileImageUrl?: string

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  @ApiProperty()
  documentNotifications!: boolean

  @Column({
    type: DataType.ENUM('NOT_DEFINED', 'NOT_VERIFIED', 'VERIFIED', 'EMPTY'),
    defaultValue: 'NOT_DEFINED',
  })
  @ApiPropertyOptional()
  emailStatus?: string

  @Column({
    type: DataType.ENUM('NOT_DEFINED', 'NOT_VERIFIED', 'VERIFIED', 'EMPTY'),
    defaultValue: 'NOT_DEFINED',
  })
  @ApiPropertyOptional()
  mobileStatus?: string

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  lastNudge?: Date

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: true,
  })
  @ApiProperty()
  emailNotifications!: boolean

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  nextNudge?: Date
}
