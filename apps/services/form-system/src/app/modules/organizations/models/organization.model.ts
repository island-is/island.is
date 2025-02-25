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
import { LanguageType } from '../../../dataTypes/languageType.model'
import { Form } from '../../forms/models/form.model'
import { OrganizationCertificationType } from '../../organizationCertificationTypes/models/organizationCertificationType.model'
import { OrganizationFieldType } from '../../organizationFieldTypes/models/organizationFieldType.model'
import { OrganizationListType } from '../../organizationListTypes/models/organizationListType.model'
import { OrganizationUrl } from '../../organizationUrls/models/organizationUrl.model'

@Table({ tableName: 'organization' })
export class Organization extends Model<Organization> {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: () => new LanguageType(),
  })
  name!: LanguageType

  @CreatedAt
  created!: CreationOptional<Date>

  @UpdatedAt
  modified!: CreationOptional<Date>

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: '',
  })
  nationalId!: string

  @HasMany(() => Form)
  forms?: Form[]

  @HasMany(() => OrganizationFieldType)
  organizationFieldTypes?: OrganizationFieldType[]

  @HasMany(() => OrganizationCertificationType)
  organizationCertificationTypes?: OrganizationCertificationType[]

  @HasMany(() => OrganizationListType)
  organizationListTypes?: OrganizationListType[]

  @HasMany(() => OrganizationUrl)
  organizationUrls?: OrganizationUrl[]
}
