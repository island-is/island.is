import { ApiProperty } from '@nestjs/swagger'
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
import { CertificationType } from '../../certifications/models/certificationType.model'

@Table({ tableName: 'organization' })
export class Organization extends Model<Organization> {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: () => new LanguageType(),
  })
  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @CreatedAt
  @ApiProperty({ type: Date })
  created!: CreationOptional<Date>

  @UpdatedAt
  @ApiProperty({ type: Date })
  modified!: CreationOptional<Date>

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: '',
  })
  @ApiProperty()
  nationalId!: string

  @HasMany(() => Form)
  @ApiProperty({ type: [Form] })
  forms?: Form[]

  @HasMany(() => ApplicantTypeNameSuggestion)
  @ApiProperty({ type: [ApplicantTypeNameSuggestion] })
  applicantTypeNameSuggestions?: ApplicantTypeNameSuggestion[]

  @BelongsToMany(() => FieldType, {
    through: 'organization_field_type',
    foreignKey: 'organization_id',
    otherKey: 'field_type_id',
  })
  organizationFieldTypes?: NonAttribute<FieldType[]>

  @BelongsToMany(() => CertificationType, {
    through: 'organization_certification_type',
    foreignKey: 'organization_id',
    otherKey: 'certification_type_id',
  })
  organizationCertificationTypes?: NonAttribute<CertificationType[]>

  @BelongsToMany(() => ListType, {
    through: 'organization_list_type',
    foreignKey: 'organization_id',
    otherKey: 'list_type_id',
  })
  organizationListTypes?: NonAttribute<ListType[]>
}
