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
import { Application } from '../../applications/models/application.model'
import { ApplicantTypesEnum } from '@island.is/form-system/shared'
import { AuthDelegationType } from '@island.is/shared/types'

@Table({ tableName: 'applicant' })
export class Applicant extends Model<Applicant> {
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
    type: DataType.DATE,
    allowNull: true,
  })
  lastLogin?: Date

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name?: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nationalId!: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phoneNumber?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  address?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  municipality?: string

  @Column({
    type: DataType.ENUM(...Object.values(AuthDelegationType)),
    allowNull: true,
  })
  delegationType?: AuthDelegationType

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(ApplicantTypesEnum),
  })
  applicantTypeId!: string

  @ForeignKey(() => Application)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'application_id',
  })
  applicationId!: string
}
