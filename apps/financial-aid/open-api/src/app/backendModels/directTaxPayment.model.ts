import { Column, DataType, Model, Table } from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

import { DirectTaxPayment, UserType } from '@island.is/financial-aid/shared/lib'

import { DirectTaxPaymentModel } from '../models'

@Table({
  tableName: 'direct_tax_payment',
  timestamps: true,
})
export class DirectTaxPaymentBackendModel extends Model<
  DirectTaxPaymentModel,
  DirectTaxPayment
> {
  @Column({
    type: DataType.INTEGER,
  })
  @ApiProperty()
  totalSalary!: number

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  payerNationalId!: string

  @Column({
    type: DataType.INTEGER,
  })
  @ApiProperty()
  personalAllowance!: number

  @Column({
    type: DataType.INTEGER,
  })
  @ApiProperty()
  withheldAtSource!: number

  @Column({
    type: DataType.INTEGER,
  })
  @ApiProperty()
  month!: number

  @Column({
    type: DataType.INTEGER,
  })
  @ApiProperty()
  year!: number

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(UserType),
  })
  @ApiProperty()
  userType!: UserType
}
