import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

import {
  HomeCircumstances,
  Employment,
  ApplicationState,
  Application,
} from '@island.is/financial-aid/shared/lib'

import { ApplicationFileModel } from '../../file/models'
import { StaffModel } from '../../staff'
import { ApplicationEventModel } from '../../applicationEvent'

@Table({
  tableName: 'applications',
  timestamps: true,
})
export class ApplicationModel extends Model<Application> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id: string

  @CreatedAt
  @ApiProperty()
  created: Date

  @UpdatedAt
  @ApiProperty()
  modified: Date

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  nationalId: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  name: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  phoneNumber: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  email: string

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(HomeCircumstances),
  })
  @ApiProperty({ enum: HomeCircumstances })
  homeCircumstances: HomeCircumstances

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  homeCircumstancesCustom: string

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(Employment),
  })
  @ApiProperty({ enum: Employment })
  employment: Employment

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  employmentCustom: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty()
  student: boolean

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  studentCustom: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty()
  usePersonalTaxCredit: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty()
  hasIncome: boolean

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  bankNumber: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  ledger: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  accountNumber: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiProperty()
  interview: boolean

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  formComment: string

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(ApplicationState),
  })
  @ApiProperty({ enum: ApplicationState })
  state: ApplicationState

  @ApiProperty({ type: [ApplicationFileModel] })
  files: ApplicationFileModel[]

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiProperty()
  amount: number

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  rejection: string

  @ForeignKey(() => StaffModel)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiProperty()
  staffId: string

  @BelongsTo(() => StaffModel, 'staffId')
  @ApiProperty({ type: StaffModel })
  staff?: StaffModel

  @ForeignKey(() => ApplicationEventModel)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiProperty()
  applicationEventsId: [string]

  // @BelongsTo(() => ApplicationEventModel, 'applicationEventsId')
  // @ApiProperty({ type: [ApplicationEventModel] })
  // applicationEvents?: ApplicationEventModel[]

  @HasMany(() => ApplicationEventModel, 'applicationEventsId')
  @ApiProperty({ type: ApplicationEventModel, isArray: true })
  applicationEvents?: ApplicationEventModel[]
}
