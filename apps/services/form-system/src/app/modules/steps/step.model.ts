import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { CreationOptional } from 'sequelize'
import { Form } from '../forms/form.model'
import { ApiProperty } from '@nestjs/swagger'

@Table({ tableName: 'steps' })
export class Step extends Model<Step> {
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  @ApiProperty()
  id!: CreationOptional<number>

  @Column({
    type: DataType.UUID,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  guid!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: '',
  })
  @ApiProperty()
  name!: string

  @CreatedAt
  @ApiProperty()
  created!: CreationOptional<Date>

  @UpdatedAt
  @ApiProperty()
  modified!: CreationOptional<Date>

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'input',
  })
  type!: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  displayOrder!: number

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: '',
  })
  waitingText?: string

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
  callRuleset!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isCompleted!: boolean

  @ForeignKey(() => Form)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'form_id' })
  formId!: number
}
