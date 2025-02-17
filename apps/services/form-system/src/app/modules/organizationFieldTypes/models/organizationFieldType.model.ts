import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Organization } from '../../organizations/models/organization.model'
import { CreationOptional } from 'sequelize'
import { FieldTypesEnum } from '../../../dataTypes/fieldTypes/fieldTypes.enum'

@Table({ tableName: 'organization_field_type' })
export class OrganizationFieldType extends Model<OrganizationFieldType> {
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

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(FieldTypesEnum),
  })
  fieldTypeId!: string
}
