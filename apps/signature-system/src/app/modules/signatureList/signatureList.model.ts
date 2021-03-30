import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { Signature } from '../signature/signature.model'
import { ValidationRuleDto } from './dto/validationRuleDto'

@Table({
  tableName: 'signatureList',
})
export class SignatureList extends Model<SignatureList> {
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
  title!: string

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  description!: string | null

  @Column({
    type: DataType.DATE,
  })
  @ApiProperty()
  closedDate!: Date | null

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  @ApiProperty()
  signatureMeta!: string[]

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  @ApiProperty()
  tags!: string[]

  @Column({
    type: DataType.JSONB,
    defaultValue: '[]',
  })
  @ApiProperty()
  validationRules!: ValidationRuleDto[]

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  owner!: string

  @HasMany(() => Signature)
  signatures!: Signature[]

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified!: Date
}
