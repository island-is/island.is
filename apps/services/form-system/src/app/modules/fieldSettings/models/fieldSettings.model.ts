import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
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

@Table({ tableName: 'field_settings' })
export class FieldSettings extends Model<FieldSettings> {
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
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiPropertyOptional({ type: Number })
  minValue?: number | null

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiPropertyOptional({ type: Number })
  maxValue?: number | null

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiPropertyOptional({ type: Number })
  minLength?: number | null

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiPropertyOptional({ type: Number })
  maxLength?: number | null

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional({ type: Date })
  minDate?: Date | null

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional({ type: Date })
  maxDate?: Date | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional({ type: String })
  minAmount?: string | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional({ type: String })
  maxAmount?: string | null

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiPropertyOptional({ type: Number })
  year?: number | null

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiPropertyOptional({ type: Boolean })
  hasLink?: boolean | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional({ type: String })
  url?: string | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional({ type: String })
  buttonText?: string | null

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiPropertyOptional({ type: Boolean })
  hasPropertyInput?: boolean | null

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiPropertyOptional({ type: Boolean })
  hasPropertyList?: boolean | null

  @HasMany(() => ListItem)
  @ApiPropertyOptional({ type: [ListItem] })
  list?: ListItem[] | null

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(ListTypes),
  })
  @ApiPropertyOptional({ enum: ListTypes })
  listType?: string | null

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  @ApiPropertyOptional({ type: String })
  fileTypes?: string | null

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiPropertyOptional({ type: Number })
  fileMaxSize?: number | null

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiPropertyOptional({ type: Number })
  maxFiles?: number | null

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(TimeIntervals),
  })
  @ApiPropertyOptional({ enum: TimeIntervals })
  timeInterval?: string | null

  @ForeignKey(() => Field)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'field_id',
  })
  fieldId!: string
}
