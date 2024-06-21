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
import { TestimonyType } from './testimonyType.model'

@Table({ tableName: 'organization_testimony_types' })
export class OrganizationTestimonyType extends Model<OrganizationTestimonyType> {
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

  @ForeignKey(() => TestimonyType)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'testimony_type_id',
  })
  testimonyTypeId!: string
}
