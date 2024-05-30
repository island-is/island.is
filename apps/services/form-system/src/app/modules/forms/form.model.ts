import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize'
import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default,
  HasMany,
  Model,
  NotNull,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { LanguageType } from '../../dataTypes/languageType.model'
import { Step } from '../steps/step.model'
import { ApiProperty } from '@nestjs/swagger'

@Table({ tableName: 'forms' })
export class Form extends Model<Form> {
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

  @Column
  @ApiProperty()
  invalidationDate?: Date

  @CreatedAt
  @ApiProperty()
  created!: CreationOptional<Date>

  @UpdatedAt
  @ApiProperty()
  modified!: CreationOptional<Date>

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  isTranslated!: boolean

  @Column({
    type: DataType.INTEGER,
    defaultValue: 60,
  })
  @ApiProperty()
  applicationDaysToRemove!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  @ApiProperty()
  derivedFrom!: number

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty()
  stopProgressOnValidatingStep!: boolean

  @Column
  @ApiProperty()
  completedMessage?: string

  @HasMany(() => Step)
  @ApiProperty()
  steps?: Step[]
}
