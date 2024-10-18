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
import { TimeIntervals } from '../../../enums/timeIntervals'
import { Field } from '../../fields/models/field.model'
import { ListTypes } from '../../../enums/listTypes'
import { ListItem } from '../../listItems/models/listItem.model'
import { LanguageType } from '../../../dataTypes/languageType.model'

@Table({ tableName: 'field_settings' })
export class FieldSettings extends Model<FieldSettings> {
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
    type: DataType.INTEGER,
    allowNull: true,
  })
  minValue?: number | null

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  maxValue?: number | null

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  minLength?: number | null

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  maxLength?: number | null

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  minDate?: Date | null

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  maxDate?: Date | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  minAmount?: string | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  maxAmount?: string | null

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  year?: number | null

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  hasLink?: boolean | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  url?: string | null

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  buttonText?: LanguageType | null

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isRequired?: boolean | null

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isLarge?: boolean | null

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  hasPropertyInput?: boolean | null

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  hasPropertyList?: boolean | null

  @HasMany(() => ListItem)
  list?: ListItem[] | null

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(ListTypes),
  })
  listType?: string | null

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  fileTypes?: string | null

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  fileMaxSize?: number | null

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  maxFiles?: number | null

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(TimeIntervals),
  })
  timeInterval?: string | null

  @ForeignKey(() => Field)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'field_id',
  })
  fieldId!: string
}
