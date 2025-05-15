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
import { CreationOptional } from 'sequelize'
import { OrganizationUrl } from '../../organizationUrls/models/organizationUrl.model'

@Table({ tableName: 'form_url' })
export class FormUrl extends Model<FormUrl> {
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

  @ForeignKey(() => OrganizationUrl)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'organization_url_id',
  })
  organizationUrlId!: string

  @ForeignKey(() => Form)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'form_id',
  })
  formId!: string
}
