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
import { Organization } from '../../organizations/models/organization.model'
import {
  CertificationTypesEnum,
  ListTypesEnum,
  FieldTypesEnum,
} from '@island.is/form-system/enums'

@Table({ tableName: 'organization_permission' })
export class OrganizationPermission extends Model<OrganizationPermission> {
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

  // @Column({
  //   type: DataType.STRING,
  //   allowNull: false,
  // })
  // type!: string

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
    values: [
      ...Object.values(CertificationTypesEnum),
      ...Object.values(ListTypesEnum),
      ...Object.values(FieldTypesEnum),
    ],
  })
  permission!: string
}
