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
  @ApiPropertyOptional()
  minValue?: number | null

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiPropertyOptional()
  maxValue?: number | null

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiPropertyOptional()
  minLength?: number | null

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiPropertyOptional()
  maxLength?: number | null

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  minDate?: Date | null

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  maxDate?: Date | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  minAmount?: string | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  maxAmount?: string | null

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiPropertyOptional()
  year?: number | null

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiPropertyOptional()
  hasLink?: boolean | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  url?: string | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  buttonText?: string | null

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiPropertyOptional()
  hasPropertyInput?: boolean | null

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiPropertyOptional()
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
  @ApiPropertyOptional()
  fileTypes?: string | null

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiPropertyOptional()
  fileMaxSize?: number | null

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiPropertyOptional()
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
