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

@Table({ tableName: 'certification' })
export class Certification extends Model<Certification> {
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
  certificationType!: string

  @CreatedAt
  created!: CreationOptional<Date>

  @UpdatedAt
  modified!: CreationOptional<Date>

  @BelongsToMany(() => Organization, {
    through: 'organization_certification',
    foreignKey: 'certification_id',
    otherKey: 'organization_id',
  })
  organizations?: NonAttribute<Organization[]>

  @BelongsToMany(() => Form, {
    through: 'form_certification',
    foreignKey: 'certification_id',
    otherKey: 'form_id',
  })
  forms?: NonAttribute<Form[]>
}
