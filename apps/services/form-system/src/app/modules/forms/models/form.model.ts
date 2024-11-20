import { CreationOptional } from 'sequelize'
import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Section } from '../../sections/models/section.model'
import { Organization } from '../../organizations/models/organization.model'
import { LanguageType } from '../../../dataTypes/languageType.model'
import { FormApplicantType } from '../../formApplicantTypes/models/formApplicantType.model'
import { Dependency } from '../../../dataTypes/dependency.model'
import { FormCertificationType } from '../../formCertificationTypes/models/formCertificationType.model'
import { FormUrl } from '../../formUrls/models/formUrl.model'

@Table({ tableName: 'form' })
export class Form extends Model<Form> {
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
    defaultValue: new LanguageType(),
  })
  name!: LanguageType

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  slug!: string

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  invalidationDate?: Date

  @CreatedAt
  created!: CreationOptional<Date>

  @UpdatedAt
  modified!: CreationOptional<Date>

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isTranslated!: boolean

  @Column({
    type: DataType.INTEGER,
    defaultValue: 60,
  })
  applicationDaysToRemove!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  derivedFrom!: number

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isPublishedInChanging!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  stopProgressOnValidatingScreen!: boolean

  @Column({
    type: DataType.JSON,
    allowNull: true,
    defaultValue: () => new LanguageType(),
  })
  completedMessage?: LanguageType

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  dependencies?: Dependency[]

  @HasMany(() => Section)
  sections!: Section[]

  @HasMany(() => FormApplicantType)
  formApplicantTypes?: FormApplicantType[]

  @HasMany(() => FormCertificationType)
  formCertificationTypes?: FormCertificationType[]

  @HasMany(() => FormUrl)
  formUrls?: FormUrl[]

  @ForeignKey(() => Organization)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'organization_id',
  })
  organizationId!: string
}
