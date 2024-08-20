import {
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { LanguageType } from '../../../dataTypes/languageType.model'
import { CreationOptional, DataTypes, NonAttribute } from 'sequelize'
import { CertificationTypes } from '../../../enums/certificationTypes'
import { Organization } from '../../organizations/models/organization.model'
import { Form } from '../../forms/models/form.model'

@Table({ tableName: 'certification_type' })
export class CertificationType extends Model<CertificationType> {
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

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: () => new LanguageType(),
  })
  description!: LanguageType

  @Column({
    type: DataTypes.ENUM,
    allowNull: false,
    values: Object.values(CertificationTypes),
  })
  type!: string

  @CreatedAt
  created!: CreationOptional<Date>

  @UpdatedAt
  modified!: CreationOptional<Date>

  @BelongsToMany(() => Organization, {
    through: 'organization_testimony_type',
    foreignKey: 'certification_type_id',
    otherKey: 'organization_id',
  })
  organizations?: NonAttribute<Organization[]>

  @BelongsToMany(() => Form, {
    through: 'form_testimony_type',
    foreignKey: 'certification_type_id',
    otherKey: 'form_id',
  })
  forms?: NonAttribute<Form[]>
}
