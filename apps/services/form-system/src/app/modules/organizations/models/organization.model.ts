import { ApiProperty } from '@nestjs/swagger'
import { CreationOptional, NonAttribute, UUID, UUIDV4 } from 'sequelize'
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
import { Form } from '../../forms/models/form.model'
import { LanguageType } from '../../../dataTypes/languageType.model'
import { ApplicantTypeNameSuggestion } from '../../applicants/models/applicantTypeNameSuggestion.model'
import { InputType } from '../../inputs/models/inputType.model'
import { TestimonyType } from '../../testimonies/models/testimonyType.model'
import { ListType } from '../../lists/models/listType.model'

@Table({ tableName: 'organizations' })
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
  @ApiProperty()
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

  @BelongsToMany(() => InputType, {
    through: 'organization_input_types',
    foreignKey: 'organization_id',
    otherKey: 'input_type_id',
  })
  organizationInputTypes?: NonAttribute<InputType[]>

  @BelongsToMany(() => TestimonyType, {
    through: 'organization_testimony_types',
    foreignKey: 'organization_id',
    otherKey: 'testimony_type_id',
  })
  organizationTestimonyTypes?: NonAttribute<TestimonyType[]>

  @BelongsToMany(() => ListType, {
    through: 'organization_list_types',
    foreignKey: 'organization_id',
    otherKey: 'list_type_id',
  })
  organizationListTypes?: NonAttribute<ListType[]>
}
