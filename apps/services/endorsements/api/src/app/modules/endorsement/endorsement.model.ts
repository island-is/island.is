import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { EndorsementList } from '../endorsementList/endorsementList.model'
import { EndorsementMetaData } from '../endorsementMetadata/endorsementMetadata.service'
@Table({
  tableName: 'endorsement',
  indexes: [
    {
      fields: ['endorser', 'endorsement_list_id'],
      unique: true,
    },
  ],
})
export class Endorsement extends Model<Endorsement> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  endorser!: string

  @ForeignKey(() => EndorsementList)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  endorsementListId!: string

  @BelongsTo(() => EndorsementList, 'endorsementListId')
  endorsementList!: EndorsementList

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  meta!: EndorsementMetaData

  @CreatedAt
  readonly created!: Date

  @UpdatedAt
  readonly modified!: Date
}
