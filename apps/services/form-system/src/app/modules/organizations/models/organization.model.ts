import { CreationOptional } from 'sequelize'
import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Form } from '../../forms/models/form.model'
import { OrganizationPermission } from '../../organizationPermissions/models/organizationPermission.model'

@Table({ tableName: 'organization' })
export class Organization extends Model<Organization> {
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
    type: DataType.STRING,
    allowNull: false,
    defaultValue: '',
    field: 'national_id',
  })
  nationalId!: string

  @HasMany(() => Form)
  forms?: Form[]

  @HasMany(() => OrganizationPermission)
  organizationPermissions?: OrganizationPermission[]
}
