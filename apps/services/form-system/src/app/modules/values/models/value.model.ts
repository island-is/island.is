import { CreationOptional } from 'sequelize'
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Field } from '../../fields/models/field.model'
import { Application } from '../../applications/models/application.model'
import { ValueType } from '../../../dataTypes/valueTypes/valueType.model'

@Table({ tableName: 'value' })
export class Value extends Model<Value> {
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
    type: DataType.JSON,
    allowNull: true,
  })
  json?: ValueType

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
    defaultValue: 0,
  })
  order!: number

  // @Column({
  //   type: DataType.BOOLEAN,
  //   allowNull: false,
  //   defaultValue: false,
  // })
  // isHidden!: boolean

  @ForeignKey(() => Field)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'field_id',
  })
  fieldId!: string

  // @ForeignKey(() => Application)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    // field: 'application_id',
  })
  applicationId!: string

  // @BelongsTo(() => Application)
  // application?: Application
}
