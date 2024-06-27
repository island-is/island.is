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
import { SectionTypes } from '../../../enums/sectionTypes'
import { Form } from '../../forms/models/form.model'
import { Screen } from '../../screens/models/screen.model'

@Table({ tableName: 'sections' })
export class Section extends Model<Section> {
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
    values: Object.values(SectionTypes),
  })
  @ApiProperty({ enum: SectionTypes })
  sectionType!: string

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

  @HasMany(() => Screen)
  @ApiProperty({ type: [Screen] })
  screens?: Screen[]

  @ForeignKey(() => Form)
  @Column({ type: DataType.STRING, allowNull: false, field: 'form_id' })
  formId!: string
}
