import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

import { ApplicationState } from '@island.is/financial-aid/shared/lib'

import {
  AmountBackendModel,
  ApplicationFileBackendModel,
  ChildrenBackendModel,
  DirectTaxPaymentBackendModel,
  StaffBackendModel,
} from './index'

@Table({
  tableName: 'applications',
  timestamps: true,
})
export class ApplicationBackendModel extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @CreatedAt
  @ApiProperty()
  created!: Date

  @UpdatedAt
  @ApiProperty()
  modified!: Date

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  nationalId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  name!: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  phoneNumber?: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  email?: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty()
  usePersonalTaxCredit!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty()
  hasIncome!: boolean

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  bankNumber?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  ledger?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  accountNumber?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  formComment?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  spouseFormComment?: string

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(ApplicationState),
  })
  @ApiProperty({ enum: ApplicationState })
  state!: ApplicationState

  @HasMany(() => ApplicationFileBackendModel, 'applicationId')
  @ApiProperty({ type: ApplicationFileBackendModel, isArray: true })
  files?: ApplicationFileBackendModel[]

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiProperty()
  rejection?: string

  @BelongsTo(() => StaffBackendModel, 'staffId')
  @ApiProperty({ type: StaffBackendModel })
  staff?: StaffBackendModel

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  spouseName?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  spouseNationalId?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  spousePhoneNumber?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  spouseEmail?: string

  @HasMany(() => AmountBackendModel, 'applicationId')
  @ApiProperty({ type: () => AmountBackendModel, nullable: true })
  amount?: AmountBackendModel

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  city?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  streetName?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  postalCode?: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  municipalityCode?: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiProperty()
  hasFetchedDirectTaxPayment?: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiProperty()
  spouseHasFetchedDirectTaxPayment?: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiProperty()
  navSuccess?: boolean

  @HasMany(() => DirectTaxPaymentBackendModel, 'applicationId')
  @ApiProperty({ type: () => DirectTaxPaymentBackendModel, isArray: true })
  directTaxPayments!: DirectTaxPaymentBackendModel[]

  @HasMany(() => ChildrenBackendModel, 'applicationId')
  @ApiProperty({ type: ChildrenBackendModel, isArray: true })
  children?: ChildrenBackendModel[]

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiProperty()
  childrenComment?: string
}
