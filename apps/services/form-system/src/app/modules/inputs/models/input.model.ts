import { ApiProperty } from '@nestjs/swagger'
import { CreationOptional } from 'sequelize'
import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Group } from '../../groups/models/group.model'
import { LanguageType } from '../../../dataTypes/languageType.model'
import { InputType } from './inputType.model'
import { InputSettings } from '../../inputSettings/models/inputSettings.model'

@Table({ tableName: 'inputs' })
export class Input extends Model<Input> {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: () => new LanguageType(),
  })
  @ApiProperty()
  name!: LanguageType

  @CreatedAt
  @ApiProperty({ type: Date })
  created!: CreationOptional<Date>

  @UpdatedAt
  @ApiProperty({ type: Date })
  modified!: CreationOptional<Date>

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  @ApiProperty()
  displayOrder!: number

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: () => new LanguageType(),
  })
  @ApiProperty()
  description!: LanguageType

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  isHidden!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  isPartOfMultiset!: boolean

  @ForeignKey(() => Group)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'group_id',
  })
  groupId!: string

  @HasOne(() => InputSettings)
  @ApiProperty({ type: InputSettings })
  inputSettings?: InputSettings

  @ForeignKey(() => InputType)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'default',
    field: 'input_type',
  })
  @ApiProperty()
  inputType!: string
}
