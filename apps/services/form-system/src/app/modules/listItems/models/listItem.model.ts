import { ApiProperty } from '@nestjs/swagger'
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
  @ApiProperty()
  id!: string

  @CreatedAt
  @ApiProperty({ type: Date })
  created!: CreationOptional<Date>

  @UpdatedAt
  @ApiProperty({ type: Date })
  modified!: CreationOptional<Date>

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: () => new LanguageType(),
  })
  @ApiProperty()
  label!: LanguageType

  @Column({
    type: DataType.JSON,
    allowNull: true,
    defaultValue: () => new LanguageType(),
  })
  @ApiProperty()
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
  @ApiProperty()
  displayOrder!: number

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  isSelected!: boolean

  @ForeignKey(() => FieldSettings)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'field_settings_id',
  })
  fieldSettingsId!: string
}
