import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

import { Amount } from '@island.is/financial-aid/shared/lib'

import { DeductionFactorsBackendModel } from './deductionFactors.model'

@Table({
  tableName: 'amount',
  timestamps: true,
})
export class AmountBackendModel extends Model<Amount> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  aidAmount!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiProperty()
  income?: number

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiProperty()
  childrenAidAmount?: number

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiProperty()
  decemberAidAmount?: number

  @HasMany(() => DeductionFactorsBackendModel, 'amountId')
  @ApiProperty({ type: DeductionFactorsBackendModel, isArray: true })
  deductionFactors?: DeductionFactorsBackendModel[]

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  personalTaxCredit!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiProperty()
  spousePersonalTaxCredit?: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  tax!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  finalAmount!: number
}
