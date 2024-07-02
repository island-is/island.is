import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { LanguageType } from '../../../dataTypes/languageType.model'
import { Organization } from '../../organizations/models/organization.model'
import { CreationOptional } from 'sequelize'
import { ApplicantTypes } from '../../../enums/applicantTypes'

@Table({ tableName: 'applicant_type_name_suggestions' })
export class ApplicantTypeNameSuggestion extends Model<ApplicantTypeNameSuggestion> {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @CreatedAt
  @ApiProperty({ type: Date })
  created!: CreationOptional<Date>

  @UpdatedAt
  @ApiProperty({ type: Date })
  modified!: CreationOptional<Date>

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: () => new LanguageType().toString(),
  })
  @ApiProperty()
  nameSuggestion!: LanguageType

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(ApplicantTypes),
    defaultValue: ApplicantTypes.INDIVIDUAL,
  })
  @ApiProperty({ enum: ApplicantTypes })
  applicantType!: string

  @ForeignKey(() => Organization)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'organization_id',
  })
  organizationId!: string
}
