import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ApplicationTranslationPublish } from './application-translation-publish.model'

@Table({
  tableName: 'application_translation_publish_snapshot',
  timestamps: false,
  indexes: [
    {
      fields: ['publish_id'],
      name: 'application_translation_publish_snapshot_publish_id_idx',
    },
  ],
})
export class ApplicationTranslationPublishSnapshot extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @ForeignKey(() => ApplicationTranslationPublish)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty()
  publishId!: string

  @Column({
    type: DataType.STRING(512),
    allowNull: false,
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

  @BelongsTo(() => ApplicationTranslationPublish)
  publish?: ApplicationTranslationPublish
}
