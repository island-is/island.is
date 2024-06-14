import { ApiProperty } from '@nestjs/swagger'
import { CreationOptional } from 'sequelize'
import {
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
import { Input } from './input.model'
import { TimeInterval } from '../../../enums/timeInterval.enum'

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
  minValue?: number

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiProperty()
  maxValue?: number

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiProperty()
  minLength?: number

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiProperty()
  maxLength?: number

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  minDate?: Date

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  maxDate?: Date

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  minAmount?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  maxAmount?: string

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiProperty()
  year?: number

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiProperty()
  hasLink?: boolean

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  url?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  buttonText?: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiProperty()
  hasPropertyInput?: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiProperty()
  hasPropertyList?: boolean

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  @ApiProperty()
  list?: string

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  @ApiProperty()
  fileTypes?: string

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiProperty()
  fileMaxSize?: number

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiProperty()
  maxFiles?: number

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: ['minutely', 'quarterly', 'halfHourly', 'hourly'],
  })
  @ApiProperty({ enum: TimeInterval })
  timeInterval?: TimeInterval

  @ForeignKey(() => Input)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'input_id',
  })
  inputId!: string
}
