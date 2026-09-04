import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ApplicationTranslation } from './application-translation.model'

@Table({
  tableName: 'application_translation_log',
  timestamps: false,
  indexes: [
    {
      fields: ['translation_id'],
      name: 'application_translation_log_translation_id_idx',
    },
  ],
})
export class ApplicationTranslationLog extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @ForeignKey(() => ApplicationTranslation)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty()
  translationId!: string

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  oldValue?: string

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  newValue?: string

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  @ApiPropertyOptional()
  changedBy?: string

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  @ApiProperty()
  action!: string

  @CreatedAt
  @Column({
    type: 'TIMESTAMP WITH TIME ZONE',
    defaultValue: DataType.NOW,
    allowNull: false,
  })
  @ApiProperty()
  created!: Date

  @BelongsTo(() => ApplicationTranslation)
  translation?: ApplicationTranslation
}
