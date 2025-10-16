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
import { Form } from '../../forms/models/form.model'
import { Dependency } from '../../../dataTypes/dependency.model'
import { ApplicationEvent } from './applicationEvent.model'
import { Organization } from '../../organizations/models/organization.model'
import { Value } from './value.model'
import { ApplicationStatus } from '@island.is/form-system/shared'

@Table({ tableName: 'application' })
export class Application extends Model<Application> {
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

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: '',
  })
  nationalId!: string

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  submittedAt?: Date

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isTest!: boolean

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(ApplicationStatus),
    defaultValue: ApplicationStatus.DRAFT,
  })
  status!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: '',
  })
  state!: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  pruned!: boolean

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  pruneAt?: Date

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  draftFinishedSteps!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  draftTotalSteps!: number

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  completed?: string[]

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  dependencies?: Dependency[]

  @HasMany(() => ApplicationEvent)
  events?: ApplicationEvent[]

  @HasMany(() => Value)
  files?: Value[]

  @HasMany(() => Value)
  values?: Value[]

  @ForeignKey(() => Form)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'form_id',
  })
  formId!: string

  @ForeignKey(() => Organization)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'organization_id',
  })
  organizationId!: string

  formName?: string
  formSlug?: string
  orgSlug?: string
  orgContentfulId?: string
  tagLabel?: string
  tagVariant?: string
  completedMessage?: string
}
