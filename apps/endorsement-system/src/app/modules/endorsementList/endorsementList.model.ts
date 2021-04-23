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
import { EndorsementMetaField } from '../endorsementMetadata/endorsementMetadata.service'
import { ValidationRuleDto } from './dto/validationRule.dto'

export enum EndorsementTag {
  PARTY_LETTER_2021 = 'partyLetter2021',
  PARTY_LETTER_NORDAUSTURKJORDAEMI_2021 = 'partyLetterNordausturkjordaemi2021',
  PARTY_LETTER_NORDVESTURKJORDAEMI_2021 = 'partyLetterNordvesturkjordaemi2021',
  PARTY_LETTER_REYKJAVIKURKJORDAEMI_NORDUR_2021 = 'partyLetterReykjavikurkjordaemiNordur2021',
  PARTY_LETTER_REYKJAVIKURKJORDAEMI_SUDUR_2021 = 'partyLetterReykjavikurkjordaemiSudur2021',
  PARTY_LETTER_SUDURKJORDAEMI_2021 = 'partyLetterSudurkjordaemi2021',
  PARTY_LETTER_SUDVESTURKJORDAEMI_2021 = 'partyLetterSudvesturkjordaemi2021',
}

@Table({
  tableName: 'endorsement_list',
})
export class EndorsementList extends Model<EndorsementList> {
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

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  endorsementMeta!: EndorsementMetaField[]

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  tags!: EndorsementTag[]

  @Column({
    type: DataType.JSONB,
    defaultValue: '[]',
  })
  validationRules!: ValidationRuleDto[]

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  owner!: string

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
