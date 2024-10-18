import { CreationOptional, NonAttribute } from 'sequelize'
import {
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { LanguageType } from '../../../dataTypes/languageType.model'
import { ApplicantTypeNameSuggestion } from '../../applicants/models/applicantTypeNameSuggestion.model'
import { Form } from '../../forms/models/form.model'
import { FieldType } from '../../fields/models/fieldType.model'
import { ListType } from '../../lists/models/listType.model'
import { Certification } from '../../certifications/models/certification.model'

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

  @HasMany(() => ApplicantTypeNameSuggestion)
  applicantTypeNameSuggestions?: ApplicantTypeNameSuggestion[]

  @BelongsToMany(() => FieldType, {
    through: 'organization_field_type',
    foreignKey: 'organization_id',
    otherKey: 'field_type_id',
  })
  organizationFieldTypes?: NonAttribute<FieldType[]>

  @BelongsToMany(() => Certification, {
    through: 'organization_certification_type',
    foreignKey: 'organization_id',
    otherKey: 'certification_type_id',
  })
  organizationCertificationTypes?: NonAttribute<Certification[]>

  @BelongsToMany(() => ListType, {
    through: 'organization_list_type',
    foreignKey: 'organization_id',
    otherKey: 'list_type_id',
  })
  organizationListTypes?: NonAttribute<ListType[]>
}
