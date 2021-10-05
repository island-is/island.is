import { ApiProperty } from '@nestjs/swagger'
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
import { EndorsementList } from '../../endorsementList/endorsementList.model'
import { EndorsementMetadata } from '../../endorsementMetadata/endorsementMetadata.model'
import { EndorsementListOpen } from './endorsementListOpen.model'

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
  @ApiProperty()
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  endorser!: string

  @ApiProperty()
  @ForeignKey(() => EndorsementList)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  endorsementListId!: string

  @ApiProperty({ type: EndorsementListOpen, required: false })
  @BelongsTo(() => EndorsementList, 'endorsementListId')
  endorsementList?: EndorsementListOpen

  @ApiProperty()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false
  })
  showName!: boolean 

  @ApiProperty({ type: EndorsementMetadata })
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  meta!: EndorsementMetadata

  @ApiProperty({
    type: String,
  })
  @CreatedAt
  readonly created!: Date

  @ApiProperty({
    type: String,
  })
  @UpdatedAt
  readonly modified!: Date
}
