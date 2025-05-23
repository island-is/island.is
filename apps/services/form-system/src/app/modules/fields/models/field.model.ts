import { CreationOptional } from 'sequelize'
import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Screen } from '../../screens/models/screen.model'
import { LanguageType } from '../../../dataTypes/languageType.model'
import { Value } from '../../applications/models/value.model'
import { FieldSettings } from '../../../dataTypes/fieldSettings/fieldSettings.model'
import { ListItem } from '../../listItems/models/listItem.model'
import { FieldTypesEnum } from '@island.is/form-system/shared'

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
    type: DataType.UUID,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  identifier!: string

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

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  fieldSettings?: FieldSettings

  @HasMany(() => ListItem)
  list?: ListItem[]

  @HasMany(() => Value)
  values?: Value[]

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(FieldTypesEnum),
    defaultValue: FieldTypesEnum.TEXTBOX,
  })
  fieldType!: string
}
