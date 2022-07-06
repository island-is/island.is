import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'
import { DirectTaxPayment, UserType } from '@island.is/financial-aid/shared/lib'
import { ApplicationModel } from '../../application/models/application.model'

@Table({
  tableName: 'direct_tax_payment',
  timestamps: true,
})
export class DirectTaxPaymentModel extends Model<
  DirectTaxPaymentModel,
  DirectTaxPayment
> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id: string

  @ForeignKey(() => ApplicationModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty()
  applicationId: string

  @Column({
    type: DataType.INTEGER,
  })
  @ApiProperty()
  totalSalary: number

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  payerNationalId: string

  @Column({
    type: DataType.INTEGER,
  })
  @ApiProperty()
  personalAllowance: number

  @Column({
    type: DataType.INTEGER,
  })
  @ApiProperty()
  withheldAtSource: number

  @Column({
    type: DataType.INTEGER,
  })
  @ApiProperty()
  month: number

  @Column({
    type: DataType.INTEGER,
  })
  @ApiProperty()
  year: number

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(UserType),
  })
  @ApiProperty()
  userType: UserType

  @CreatedAt
  @ApiProperty()
  created: Date

  @UpdatedAt
  @ApiProperty()
  modified: Date
}
