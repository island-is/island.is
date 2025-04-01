import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { LanguageType } from '../../../dataTypes/languageType.model'
import { Form } from '../../forms/models/form.model'
import { CreationOptional } from 'sequelize'
import { ApplicantTypesEnum } from '@island.is/form-system/shared'

@Table({ tableName: 'form_applicant_type' })
export class FormApplicantType extends Model<FormApplicantType> {
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
    allowNull: false,
    defaultValue: () => new LanguageType(),
  })
  name!: LanguageType

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(ApplicantTypesEnum),
  })
  applicantTypeId!: string

  @ForeignKey(() => Form)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'form_id',
  })
  formId!: string
}
