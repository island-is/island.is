import {
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ApplicationTranslationPublishSnapshot } from './application-translation-publish-snapshot.model'

@Table({
  tableName: 'application_translation_publish',
  timestamps: false,
  indexes: [
    {
      fields: ['namespace'],
      name: 'application_translation_publish_namespace_idx',
    },
  ],
})
export class ApplicationTranslationPublish extends Model {
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
    type: DataType.STRING(20),
    allowNull: true,
  })
  @ApiPropertyOptional()
  publishedBy?: string

  @Column({
    type: 'TIMESTAMP WITH TIME ZONE',
    defaultValue: DataType.NOW,
    allowNull: false,
  })
  @ApiProperty()
  publishedAt!: Date

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    field: 'actor_national_id',
  })
  @ApiPropertyOptional()
  actorNationalId?: string

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional()
  note?: string

  @HasMany(() => ApplicationTranslationPublishSnapshot)
  snapshots?: ApplicationTranslationPublishSnapshot[]
}
