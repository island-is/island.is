import { ApiProperty } from '@nestjs/swagger'
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
import { Step } from '../../steps/models/step.model'
import { CreationOptional } from 'sequelize'
import { Input } from '../../inputs/models/input.model'
import { LanguageType } from '../../../dataTypes/languageType.model'

@Table({ tableName: 'groups' })
export class Group extends Model<Group> {
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
  isHidden!: boolean

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  @ApiProperty()
  multiset!: number

  @HasMany(() => Input)
  @ApiProperty({ type: [Input] })
  inputs?: Input[]

  @ForeignKey(() => Step)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'step_id',
  })
  stepId!: string
}
