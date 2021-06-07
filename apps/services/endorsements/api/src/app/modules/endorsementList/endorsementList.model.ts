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
import { Endorsement } from '../endorsement/endorsement.model'
import { EndorsementMetaField } from '../endorsementMetadata/types'
import { ValidationRuleDto } from './dto/validationRule.dto'

export enum EndorsementTag {
  PARTY_LETTER_2021 = 'partyLetter2021',
  PARTY_APPLICATION_NORDAUSTURKJORDAEMI_2021 = 'partyApplicationNordausturkjordaemi2021',
  PARTY_APPLICATION_NORDVESTURKJORDAEMI_2021 = 'partyApplicationNordvesturkjordaemi2021',
  PARTY_APPLICATION_REYKJAVIKURKJORDAEMINORDUR_2021 = 'partyApplicationReykjavikurkjordaemiNordur2021',
  PARTY_APPLICATION_REYKJAVIKURKJORDAEMISUDUR_2021 = 'partyApplicationReykjavikurkjordaemiSudur2021',
  PARTY_APPLICATION_SUDURKJORDAEMI_2021 = 'partyApplicationSudurkjordaemi2021',
  PARTY_APPLICATION_SUDVESTURKJORDAEMI_2021 = 'partyApplicationSudvesturkjordaemi2021',
}

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
    type: String,
    nullable: true,
  })
  @Column({
    type: DataType.DATE,
  })
  closedDate!: Date | null

  @ApiProperty({ enum: EndorsementMetaField, isArray: true })
  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  endorsementMeta!: EndorsementMetaField[]

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

  @ApiProperty({ type: () => [Endorsement], required: false })
  @HasMany(() => Endorsement)
  readonly endorsements?: Endorsement[]

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
