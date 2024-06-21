import { ApiProperty } from '@nestjs/swagger'
import { CreationOptional } from 'sequelize'
import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { TimeIntervals } from '../../../enums/timeIntervals'
import { Input } from '../../inputs/models/input.model'

@Table({ tableName: 'input_settings' })
export class InputSettings extends Model<InputSettings> {
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
  @ApiProperty()
  minValue?: number | null

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiProperty()
  maxValue?: number | null

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiProperty()
  minLength?: number | null

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiProperty()
  maxLength?: number | null

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  minDate?: Date | null

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  maxDate?: Date | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  minAmount?: string | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  maxAmount?: string | null

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiProperty()
  year?: number | null

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiProperty()
  hasLink?: boolean | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  url?: string | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  buttonText?: string | null

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiProperty()
  hasPropertyInput?: boolean | null

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiProperty()
  hasPropertyList?: boolean | null

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  @ApiProperty()
  list?: string | null

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  @ApiProperty()
  fileTypes?: string | null

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiProperty()
  fileMaxSize?: number | null

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiProperty()
  maxFiles?: number | null

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(TimeIntervals),
  })
  @ApiProperty({ enum: TimeIntervals })
  timeInterval?: string | null

  @ForeignKey(() => Input)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'input_id',
  })
  inputId!: string
}
