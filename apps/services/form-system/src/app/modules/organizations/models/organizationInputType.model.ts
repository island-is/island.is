import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Organization } from './organization.model'
import { InputType } from '../../inputs/models/inputType.model'
import { CreationOptional } from 'sequelize'

@Table({ tableName: 'organization_input_types' })
export class OrganizationInputType extends Model<OrganizationInputType> {
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

  @ForeignKey(() => Organization)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'organization_id',
  })
  organizationId!: string

  @ForeignKey(() => InputType)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'input_type_id',
  })
  inputTypeId!: string
}
