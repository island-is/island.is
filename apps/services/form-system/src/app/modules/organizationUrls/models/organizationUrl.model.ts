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
import { UrlTypes, UrlMethods } from '@island.is/form-system/shared'

@Table({ tableName: 'organization_url' })
export class OrganizationUrl extends Model<OrganizationUrl> {
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
  })
  url!: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isXroad!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isTest!: boolean

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(UrlTypes),
  })
  type!: string

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(UrlMethods),
  })
  method!: string

  @ForeignKey(() => Organization)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'organization_id',
  })
  organizationId!: string
}
