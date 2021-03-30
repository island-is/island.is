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
import { ApiProperty } from '@nestjs/swagger'
import { SignatureList } from '../signatureList/signatureList.model'
import { SignatureMetaField } from '../signatureList/dto/signatureList.dto'

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
  @ApiProperty()
  id!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  signaturee!: string

  @ForeignKey(() => SignatureList)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty()
  signatureListId!: string

  @BelongsTo(() => SignatureList, 'signatureListId')
  @ApiProperty({ type: SignatureList })
  signatureList!: SignatureList

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  @ApiProperty()
  meta!: SignatureMetaData

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified!: Date
}
