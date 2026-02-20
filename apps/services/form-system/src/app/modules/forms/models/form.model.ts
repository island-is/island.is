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
  BelongsTo,
} from 'sequelize-typescript'
import { CompletedSectionInfo } from '../../../dataTypes/completedSectionInfo.model'
import { Dependency } from '../../../dataTypes/dependency.model'
import { LanguageType } from '../../../dataTypes/languageType.model'
import { FormCertificationType } from '../../formCertificationTypes/models/formCertificationType.model'
import { Organization } from '../../organizations/models/organization.model'
import { Section } from '../../sections/models/section.model'
import { Application } from '../../applications/models/application.model'

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
  zendeskInternal!: boolean

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: '',
  })
  submissionServiceUrl!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: '',
  })
  validationServiceUrl!: string

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
  daysUntilApplicationPrune!: number

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  derivedFrom!: string | null

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
    type: DataType.NUMBER,
    allowNull: false,
    defaultValue: 0,
  })
  draftTotalSteps!: number

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  dependencies?: Dependency[]

  @HasMany(() => Section)
  sections!: Section[]

  @HasMany(() => FormCertificationType)
  formCertificationTypes?: FormCertificationType[]

  @ForeignKey(() => Organization)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'organization_id',
  })
  organizationId!: string

  @BelongsTo(() => Organization, 'organizationId')
  organization?: Organization

  @HasMany(() => Application)
  applications?: Application[]
}
