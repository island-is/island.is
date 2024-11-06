import { CreationOptional } from 'sequelize'
import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Screen } from '../../screens/models/screen.model'
import { LanguageType } from '../../../dataTypes/languageType.model'
import { FieldType } from './fieldType.model'
// import { FieldSettings } from '../../fieldSettings/models/fieldSettings.model'
import { Value } from '../../values/models/value.model'
import { FieldSettings } from '../../../dataTypes/fieldSettings/fieldSettings.model'
import { ListItem } from '../../listItems/models/listItem.model'

@Table({ tableName: 'field' })
export class Field extends Model<Field> {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: () => new LanguageType(),
  })
  name!: LanguageType

  @CreatedAt
  created!: CreationOptional<Date>

  @UpdatedAt
  modified!: CreationOptional<Date>

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  displayOrder!: number

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: () => new LanguageType(),
  })
  description!: LanguageType

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isHidden!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isRequired!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isPartOfMultiset!: boolean

  @ForeignKey(() => Screen)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'screen_id',
  })
  screenId!: string

  // @HasOne(() => FieldSettings)
  // fieldSettings?: FieldSettings

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  fieldSettings?: FieldSettings

  @HasMany(() => ListItem)
  list?: ListItem[]

  @HasMany(() => Value)
  values?: Value[]

  @ForeignKey(() => FieldType)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'field_type',
  })
  fieldType!: string
}
