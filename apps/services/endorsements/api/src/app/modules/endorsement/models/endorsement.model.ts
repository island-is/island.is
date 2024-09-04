import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { EndorsementList } from '../../endorsementList/endorsementList.model';
import { EndorsementMetadata } from './endorsementMetadata.model';
import { EndorsementListOpen } from './endorsementListOpen.model';

@Table({
  tableName: 'endorsement',
  indexes: [
    {
      fields: ['endorser', 'endorsement_list_id'],
      unique: true,
    },
  ],
})
export class Endorsement extends Model {
  @ApiProperty({ type: String, description: 'The unique identifier of the endorsement' })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @ApiProperty({ type: Number, description: 'An index used for cursor based pagination', nullable: true })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  counter!: number;

  @ApiProperty({ type: String, description: 'The endorsers nationalId' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  endorser!: string;

  @ApiProperty({ type: String, description: 'The ID of the endorsement list this endorsement belongs to' })
  @ForeignKey(() => EndorsementList)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  endorsementListId!: string;

  @ApiProperty({ type: () => EndorsementListOpen, description: 'The endorsement list this endorsement belongs to', required: false })
  @BelongsTo(() => EndorsementList, 'endorsementListId')
  endorsementList?: EndorsementListOpen;

  @ApiProperty({ type: () => EndorsementMetadata, description: 'Metadata associated with the endorsement' })
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  meta!: EndorsementMetadata;

  @ApiProperty({ type: Date, description: 'The date when the endorsement was created' })
  @CreatedAt
  readonly created!: Date;

  @ApiProperty({ type: Date, description: 'The date when the endorsement was last modified' })
  @UpdatedAt
  readonly modified!: Date;
}
