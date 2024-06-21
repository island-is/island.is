import { CreationOptional } from 'sequelize'
import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Form } from '../../forms/models/form.model'
import { TestimonyType } from '../../testimonies/models/testimonyType.model'

@Table({ tableName: 'form_testimony_types' })
export class FormTestimonyType extends Model<FormTestimonyType> {
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

  @ForeignKey(() => Form)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'form_id',
  })
  formId!: string

  @ForeignKey(() => TestimonyType)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'testimony_type_id',
  })
  testimonyTypeId!: string
}
