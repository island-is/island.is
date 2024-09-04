import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Endorsement } from '../endorsement/models/endorsement.model';
import { EndorsementTag } from './constants';
import { EndorsementMetadataDto } from './dto/endorsementMetadata.dto';

@Table({
  tableName: 'endorsement_list',
})
export class EndorsementList extends Model {
  @ApiProperty({ type: String, description: 'The unique identifier of the endorsement list' })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @ApiProperty({ type: Number, description: 'A linear index intended for cursor based pagination', nullable: true })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  counter!: number;

  @ApiProperty({ type: String, description: 'The title of the endorsement list' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @ApiProperty({ type: String, description: 'A description of the endorsement list', nullable: true })
  @Column({
    type: DataType.TEXT,
  })
  description!: string | null;

  @ApiProperty({ type: Date, description: 'The date when the list was opened' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  openedDate!: Date;

  @ApiProperty({ type: Date, description: 'The date when the list was closed' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  closedDate!: Date;

  @ApiProperty({ type: [EndorsementMetadataDto], description: 'Metadata associated with endorsements' })
  @Column({
    type: DataType.JSONB,
    defaultValue: '[]',
  })
  endorsementMetadata!: EndorsementMetadataDto[];

  @ApiProperty({ enum: EndorsementTag, isArray: true, description: 'Tags associated with the endorsement list' })
  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  tags!: EndorsementTag[];

  @ApiProperty({ type: String, description: 'The owner of the endorsement list' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  owner!: string;

  @ApiProperty({ type: Boolean, description: 'Indicates if the list is admin locked' })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  adminLock!: boolean;

  @ApiProperty({ type: () => [Endorsement], description: 'Endorsements associated with the list', required: false })
  @HasMany(() => Endorsement)
  endorsements?: Endorsement[];

  @ApiProperty({ type: Object, description: 'Additional metadata for the endorsement list' })
  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: '{}',
  })
  meta!: object;

  @ApiProperty({ type: Date, description: 'The creation date of the endorsement list' })
  @CreatedAt
  readonly created!: Date;

  @ApiProperty({ type: Date, description: 'The last modified date of the endorsement list' })
  @UpdatedAt
  readonly modified!: Date;

  @ApiProperty({ type: Number, description: 'The number of endorsements in the list' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  endorsementCount!: number;
}
