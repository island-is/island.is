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
import { CertificationType } from './certificationType.model'

@Table({ tableName: 'organization_certification_type' })
export class OrganizationCertificationType extends Model<OrganizationCertificationType> {
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

  @ForeignKey(() => CertificationType)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'certification_type_id',
  })
  certificationTypeId!: string
}
