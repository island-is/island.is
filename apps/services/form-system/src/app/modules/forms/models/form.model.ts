import { CreationOptional, NonAttribute } from 'sequelize'
import {
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Step } from '../../steps/models/step.model'
import { ApiProperty } from '@nestjs/swagger'
import { Organization } from '../../organizations/models/organization.model'
import { LanguageType } from '../../../dataTypes/languageType.model'
import { FormApplicant } from '../../applicants/models/formApplicant.model'
import { TestimonyType } from '../../testimonies/models/testimonyType.model'

@Table({ tableName: 'forms' })
export class Form extends Model<Form> {
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
    defaultValue: new LanguageType(),
  })
  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @Column
  @ApiProperty()
  invalidationDate?: Date

  @CreatedAt
  @ApiProperty({ type: Date })
  created!: CreationOptional<Date>

  @UpdatedAt
  @ApiProperty({ type: Date })
  modified!: CreationOptional<Date>

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  isTranslated!: boolean

  @Column({
    type: DataType.INTEGER,
    defaultValue: 60,
  })
  @ApiProperty()
  applicationDaysToRemove!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  @ApiProperty()
  derivedFrom!: number

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty()
  stopProgressOnValidatingStep!: boolean

  @Column({
    type: DataType.JSON,
    allowNull: true,
    defaultValue: () => new LanguageType(),
  })
  @ApiProperty({ type: LanguageType })
  completedMessage?: LanguageType

  @HasMany(() => Step)
  @ApiProperty({ type: [Step] })
  steps!: Step[]

  @HasMany(() => FormApplicant)
  @ApiProperty({ type: [FormApplicant] })
  applicants?: FormApplicant[]

  @ForeignKey(() => Organization)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'organization_id',
  })
  organizationId!: string

  @BelongsToMany(() => TestimonyType, {
    through: 'form_testimony_types',
    foreignKey: 'form_id',
    otherKey: 'testimony_type_id',
  })
  testimonyTypes?: NonAttribute<TestimonyType[]>
}
