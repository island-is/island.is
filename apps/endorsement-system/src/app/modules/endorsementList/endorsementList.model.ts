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
import { ValidationRuleDto } from './dto/ValidationRules.dto'

// TODO: Move this type to the metadata service
export enum EndorsementMetaField {
  FULL_NAME = 'fullName',
  ADDRESS = 'address',
}

export enum EndorsementTag {
  NORDAUSTURKJORDAEMI = 'nordausturkjordaemi',
  NORDVESTURKJORDAEMI = 'nordvesturkjordaemi',
  REYKJAVIKURKJORDAEMI_NORDUR = 'reykjavikurkjordaemiNordur',
  REYKJAVIKURKJORDAEMI_SUDUR = 'reykjavikurkjordaemiSudur',
  SUDURKJORDAEMI = 'sudurkjordaemi',
  SUDVESTURKJORDAEMI = 'sudvesturkjordaemi',
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

  @Column({
    type: DataType.TEXT,
  })
  description!: string | null

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
  readonly endorsements!: Endorsement[]

  @CreatedAt
  readonly created!: Date

  @UpdatedAt
  readonly modified!: Date
}
