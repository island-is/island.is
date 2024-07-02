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
import { Screen } from '../../screens/models/screen.model'
import { LanguageType } from '../../../dataTypes/languageType.model'
import { FieldType } from './fieldType.model'
import { FieldSettings } from '../../fieldSettings/models/fieldSettings.model'

@Table({ tableName: 'fields' })
export class Field extends Model<Field> {
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

  @ForeignKey(() => Screen)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'screen_id',
  })
  screenId!: string

  @HasOne(() => FieldSettings)
  @ApiProperty({ type: FieldSettings })
  fieldSettings?: FieldSettings

  @ForeignKey(() => FieldType)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'default',
    field: 'field_type',
  })
  @ApiProperty()
  fieldType!: string
}
