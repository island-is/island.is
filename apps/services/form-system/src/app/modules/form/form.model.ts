import { CreationOptional } from 'sequelize'
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

@Table({ tableName: 'forms' })
export class Form extends Model<Form> {
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  id!: CreationOptional<number>

  @Column({
    type: DataType.UUIDV4,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  guid!: string
}
