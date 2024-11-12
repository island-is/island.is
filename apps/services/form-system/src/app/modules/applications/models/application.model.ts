import { CreationOptional } from 'sequelize'
import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Form } from '../../forms/models/form.model'

@Table({ tableName: 'application' })
export class Application extends Model<Application> {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string

  @CreatedAt
  created!: CreationOptional<Date>

  @UpdatedAt
  modified!: CreationOptional<Date>

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isTest!: boolean

  // @Column({
  //   type: DataType.JSON,
  //   allowNull: true,
  // })
  // hiddenComponents?: Record<string, string>

  @ForeignKey(() => Form)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'form_id',
  })
  formId!: string
}
