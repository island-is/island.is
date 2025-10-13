import { FormStatus } from '@island.is/form-system/shared'
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
import { CompletedSectionInfo } from '../../../dataTypes/completedSectionInfo.model'
import { Dependency } from '../../../dataTypes/dependency.model'
import { LanguageType } from '../../../dataTypes/languageType.model'
import { FormCertificationType } from '../../formCertificationTypes/models/formCertificationType.model'
import { FormUrl } from '../../formUrls/models/formUrl.model'
import { Organization } from '../../organizations/models/organization.model'
import { Section } from '../../sections/models/section.model'

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
    type: DataType.UUID,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  identifier!: string

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: new LanguageType(),
  })
  name!: LanguageType

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  slug!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  organizationNationalId!: string

  @Column({
    type: DataType.JSON,
    allowNull: true,
    defaultValue: new LanguageType(),
  })
  organizationDisplayName?: LanguageType

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
  hasPayment!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  beenPublished!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isTranslated!: boolean

  @Column({
    type: DataType.INTEGER,
    defaultValue: 30,
  })
  applicationDaysToRemove!: number

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  derivedFrom!: string

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(FormStatus),
    defaultValue: FormStatus.IN_DEVELOPMENT,
  })
  status!: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  allowProceedOnValidationFail!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  hasSummaryScreen!: boolean

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: () => ({
      title: new LanguageType(),
      confirmationHeader: new LanguageType(),
      confirmationText: new LanguageType(),
      additionalInfo: [],
    }),
  })
  completedSectionInfo!: CompletedSectionInfo

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  dependencies?: Dependency[]

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: [],
  })
  allowedDelegationTypes!: string[]

  @HasMany(() => Section)
  sections!: Section[]

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
