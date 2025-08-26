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
import { CertificationTypesEnum } from '@island.is/form-system/shared'

@Table({ tableName: 'form_certification_type' })
export class FormCertificationType extends Model<FormCertificationType> {
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

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(CertificationTypesEnum),
  })
  certificationTypeId!: string
}
