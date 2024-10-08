import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { LanguageType } from '../../../dataTypes/languageType.model'
import { CreationOptional } from 'sequelize'
import { FieldSettings } from '../../fieldSettings/models/fieldSettings.model'

@Table({ tableName: 'list_item' })
export class ListItem extends Model<ListItem> {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string

  @CreatedAt
  created!: CreationOptional<Date>

  @UpdatedAt
  modified!: CreationOptional<Date>

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: () => new LanguageType(),
  })
  label!: LanguageType

  @Column({
    type: DataType.JSON,
    allowNull: true,
    defaultValue: () => new LanguageType(),
  })
  description?: LanguageType

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: '',
  })
  value!: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  displayOrder!: number

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isSelected!: boolean

  @ForeignKey(() => FieldSettings)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'field_settings_id',
  })
  fieldSettingsId!: string
}
