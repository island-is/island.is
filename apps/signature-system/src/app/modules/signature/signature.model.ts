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
import {
  SignatureList,
  SignatureMetaField,
} from '../signatureList/signatureList.model'

// TODO: Move this type to the metadata service
// TODO: Map out all potential key/values types
export type SignatureMetaData = {
  [key in keyof typeof SignatureMetaField]?: any
}

@Table({
  tableName: 'signature',
  indexes: [
    {
      fields: ['signaturee', 'signature_list_id'],
      unique: true,
    },
  ],
})
export class Signature extends Model<Signature> {
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
  signaturee!: string

  @ForeignKey(() => SignatureList)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  signatureListId!: string

  @BelongsTo(() => SignatureList, 'signatureListId')
  signatureList!: SignatureList

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  meta!: SignatureMetaData

  @CreatedAt
  readonly created!: Date

  @UpdatedAt
  readonly modified!: Date
}
