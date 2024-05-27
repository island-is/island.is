import {
  AutoIncrement,
  Column,
  DataType,
  Default,
  Model,
  NotNull,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'
import { LanguageType } from '../../dataTypes/languageType.model'
import { CreationOptional } from 'sequelize'

@Table({ tableName: 'forms' })
export class Step extends Model<Step> {
  @Column({
    type: DataType.INTEGER,
  })
  @PrimaryKey
  @NotNull
  @AutoIncrement
  id!: CreationOptional<number>

  @Column({
    type: DataType.UUIDV4,
  })
  @NotNull
  @Default(DataType.UUIDV4)
  guid!: string

  @Column
  name!: LanguageType

  @Column
  type!: string

  @Column
  displayOrder!: number

  @Column
  waitingText?: string

  @Column
  isHidden!: boolean

  @Column
  callRuleset!: boolean

  @Column
  isCompleted!: boolean
}
