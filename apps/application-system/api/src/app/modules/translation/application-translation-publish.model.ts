import { Column, DataType, Model, Table } from 'sequelize-typescript'

export enum TranslationPublishAction {
  PUBLISH = 'publish',
  ROLLBACK = 'rollback',
}

@Table({
  tableName: 'application_translation_publish',
  timestamps: false,
  freezeTableName: true,
})
export class ApplicationTranslationPublish extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  id!: string

  @Column({
    type: 'TIMESTAMP WITH TIME ZONE',
    defaultValue: DataType.NOW,
    allowNull: false,
    field: 'created_at',
  })
  createdAt!: Date

  @Column({ type: DataType.STRING(255), allowNull: false })
  namespace!: string

  @Column({ type: DataType.STRING(16), allowNull: false })
  action!: TranslationPublishAction

  @Column({
    type: DataType.STRING(64),
    allowNull: false,
    field: 'contentful_snapshot_id',
  })
  contentfulSnapshotId!: string

  @Column({ type: DataType.STRING(255), allowNull: false, field: 'actor_name' })
  actorName!: string

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'on_behalf_of_name',
  })
  onBehalfOfName?: string | null

  @Column({
    type: DataType.STRING(64),
    allowNull: true,
    field: 'rolled_back_to_snapshot_id',
  })
  rolledBackToSnapshotId?: string | null

  @Column({
    type: 'TIMESTAMP WITH TIME ZONE',
    allowNull: true,
    field: 'rolled_back_to_published_at',
  })
  rolledBackToPublishedAt?: Date | null
}
