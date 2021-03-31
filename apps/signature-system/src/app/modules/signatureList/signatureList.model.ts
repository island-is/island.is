import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Signature } from '../signature/signature.model'
import { ValidationRuleDto } from './dto/validationRule.dto'
import { SignatureMetaField, SignatureTag } from './dto/signatureList.dto'

@Table({
  tableName: 'signature_list',
})
export class SignatureList extends Model<SignatureList> {
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
    type: DataType.STRING,
  })
  description!: string | null

  @Column({
    type: DataType.DATE,
  })
  closedDate!: Date | null

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  signatureMeta!: SignatureMetaField[]

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  tags!: SignatureTag[]

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

  @HasMany(() => Signature)
  readonly signatures!: Signature[]

  @CreatedAt
  readonly created!: Date

  @UpdatedAt
  readonly modified!: Date
}
