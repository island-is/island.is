import { ApiProperty } from '@nestjs/swagger'
import { CreationOptional, DataTypes } from 'sequelize'
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
import { LanguageType } from '../../../dataTypes/languageType.model'
import { StepTypes } from '../../../enums/stepTypes'
import { Form } from '../../forms/models/form.model'
import { Group } from '../../groups/models/group.model'

@Table({ tableName: 'steps' })
export class Step extends Model<Step> {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: () => new LanguageType(),
  })
  @ApiProperty()
  name!: LanguageType

  @CreatedAt
  @ApiProperty({ type: Date })
  created!: CreationOptional<Date>

  @UpdatedAt
  @ApiProperty({ type: Date })
  modified!: CreationOptional<Date>

  @Column({
    type: DataTypes.ENUM,
    allowNull: false,
    values: Object.values(StepTypes),
  })
  @ApiProperty({ enum: StepTypes })
  stepType!: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  @ApiProperty()
  displayOrder!: number

  @Column({
    type: DataType.JSON,
    allowNull: true,
    defaultValue: () => new LanguageType(),
  })
  @ApiProperty({ type: LanguageType })
  waitingText?: LanguageType

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  isHidden!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  callRuleset!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  isCompleted!: boolean

  @HasMany(() => Group)
  @ApiProperty({ type: [Group] })
  groups?: Group[]

  @ForeignKey(() => Form)
  @Column({ type: DataType.STRING, allowNull: false, field: 'form_id' })
  formId!: string
}
