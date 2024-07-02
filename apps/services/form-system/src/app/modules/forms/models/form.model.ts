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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Organization } from '../../organizations/models/organization.model'
import { LanguageType } from '../../../dataTypes/languageType.model'
import { FormApplicant } from '../../applicants/models/formApplicant.model'
import { CertificationType } from '../../certifications/models/certificationType.model'
import { randomUUID } from 'crypto'

@Table({ tableName: 'form' })
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
    unique: true,
    defaultValue: randomUUID(),
  })
  urlName!: string

  @Column
  @ApiPropertyOptional({ type: Date })
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
  @ApiPropertyOptional({ type: LanguageType })
  completedMessage?: LanguageType

  @HasMany(() => Section)
  @ApiProperty({ type: [Section] })
  sections!: Section[]

  @HasMany(() => FormApplicant)
  @ApiPropertyOptional({ type: [FormApplicant] })
  applicants?: FormApplicant[]

  @ForeignKey(() => Organization)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'organization_id',
  })
  organizationId!: string

  @BelongsToMany(() => CertificationType, {
    through: 'form_certification_type',
    foreignKey: 'form_id',
    otherKey: 'certification_type_id',
  })
  certificationTypes?: NonAttribute<CertificationType[]>
}
