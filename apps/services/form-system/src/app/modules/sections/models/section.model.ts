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
import { SectionTypes } from '@island.is/form-system/shared'
import { Form } from '../../forms/models/form.model'
import { Screen } from '../../screens/models/screen.model'

@Table({ tableName: 'section' })
export class Section extends Model<Section> {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string

  @Column({
    type: DataType.UUID,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  identifier!: string

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: () => new LanguageType(),
  })
  name!: LanguageType

  @CreatedAt
  created!: CreationOptional<Date>

  @UpdatedAt
  modified!: CreationOptional<Date>

  @Column({
    type: DataTypes.ENUM,
    allowNull: false,
    values: Object.values(SectionTypes),
    defaultValue: SectionTypes.INPUT,
  })
  sectionType!: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  displayOrder!: number

  @Column({
    type: DataType.JSON,
    allowNull: true,
    defaultValue: () => new LanguageType(),
  })
  waitingText?: LanguageType

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isCompleted!: boolean

  @HasMany(() => Screen)
  screens!: Screen[]

  @ForeignKey(() => Form)
  @Column({ type: DataType.STRING, allowNull: false, field: 'form_id' })
  formId!: string
}
