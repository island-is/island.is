import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { CreationOptional } from 'sequelize'
import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { ApplicantTypes } from '../../../enums/applicantTypes'
import { Application } from '../../applications/models/application.model'

@Table({ tableName: 'applicant' })
export class Applicant extends Model<Applicant> {
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
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  lastLogin?: Date

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: '',
  })
  @ApiProperty()
  name!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: '',
  })
  @ApiProperty()
  nationalId!: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  email!: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  phoneNumber!: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  address!: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  municipality!: string

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(ApplicantTypes),
    defaultValue: ApplicantTypes.INDIVIDUAL,
  })
  @ApiProperty({ enum: ApplicantTypes })
  applicantType!: string

  @ForeignKey(() => Application)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'application_id',
  })
  applicationId!: string
}
