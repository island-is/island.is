import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Endorsement } from '../endorsement/models/endorsement.model'
import { ValidationRuleDto } from './dto/validationRule.dto'
import { EndorsementTag } from './constants'
import { EndorsementMetadataDto } from './dto/endorsementMetadata.dto'

@Table({
  tableName: 'endorsement_list',
})
export class EndorsementList extends Model<EndorsementList> {
  @ApiProperty()
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string

  @ApiProperty()
  @Column({
    type: DataType.NUMBER,
    allowNull: true,
  })
  counter!: number

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string

  @ApiProperty({
    type: String,
    nullable: true,
  })
  @Column({
    type: DataType.TEXT,
  })
  description!: string | null

  @ApiProperty({
    type: Date,
    nullable: false,
  })
  @Column({
    type: DataType.DATE,
  })
  openedDate!: Date

  @ApiProperty({
    type: Date,
    nullable: false,
  })
  @Column({
    type: DataType.DATE,
  })
  closedDate!: Date

  @ApiProperty({ type: [EndorsementMetadataDto] })
  @Column({
    type: DataType.JSONB,
    defaultValue: '[]',
  })
  endorsementMetadata!: EndorsementMetadataDto[]

  @ApiProperty({ enum: EndorsementTag, isArray: true })
  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  tags!: EndorsementTag[]

  @ApiProperty({ type: [ValidationRuleDto] })
  @Column({
    type: DataType.JSONB,
    defaultValue: '[]',
  })
  validationRules!: ValidationRuleDto[]

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  owner!: string

  @ApiProperty()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  adminLock!: boolean

  @ApiProperty({ type: () => [Endorsement], required: false })
  @HasMany(() => Endorsement)
  endorsements?: Endorsement[]

  @ApiProperty()
  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: '{}',
  })
  meta!: object

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
