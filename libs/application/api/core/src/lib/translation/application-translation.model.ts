import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ApplicationTranslationLog } from './application-translation-log.model'

@Table({
  tableName: 'application_translation',
  timestamps: true,
  indexes: [
    {
      fields: ['namespace'],
      name: 'application_translation_namespace_idx',
    },
  ],
})
export class ApplicationTranslation extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  @ApiProperty()
  namespace!: string

  @Column({
    type: DataType.STRING(512),
    allowNull: false,
    unique: 'application_translation_namespace_message_key_unique',
  })
  @ApiProperty()
  messageKey!: string

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  @ApiProperty()
  valueIs!: string

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  valueEn?: string

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  defaultMessage?: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  isReviewed!: boolean

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  @ApiPropertyOptional()
  translatedBy?: string

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  @ApiPropertyOptional()
  reviewedBy?: string

  @CreatedAt
  @ApiProperty()
  created!: Date

  @UpdatedAt
  @ApiProperty()
  modified!: Date

  @HasMany(() => ApplicationTranslationLog)
  logs?: ApplicationTranslationLog[]
}
