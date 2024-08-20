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
import { ApplicantTypes } from '../../../enums/applicantTypes'

@Table({ tableName: 'form_applicant' })
export class FormApplicant extends Model<FormApplicant> {
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
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(ApplicantTypes),
    defaultValue: 'individual',
  })
  applicantType!: string

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: () => new LanguageType().toString(),
  })
  name!: LanguageType

  @ForeignKey(() => Form)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'form_id',
  })
  formId!: string
}
