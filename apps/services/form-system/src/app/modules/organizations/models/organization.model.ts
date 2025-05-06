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
import { OrganizationUrl } from '../../organizationUrls/models/organizationUrl.model'
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

  @HasMany(() => OrganizationPermission)
  organizationPermissions?: OrganizationPermission[]

  @HasMany(() => OrganizationUrl)
  organizationUrls?: OrganizationUrl[]
}
