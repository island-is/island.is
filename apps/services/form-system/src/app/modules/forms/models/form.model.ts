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
import { Section } from '../../sections/models/section.model'
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

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: '',
  })
  urlName!: string

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
  stopProgressOnValidatingScreen!: boolean

  @Column({
    type: DataType.JSON,
    allowNull: true,
    defaultValue: () => new LanguageType(),
  })
  @ApiProperty({ type: LanguageType })
  completedMessage?: LanguageType

  @HasMany(() => Section)
  @ApiProperty({ type: [Section] })
  sections!: Section[]

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
