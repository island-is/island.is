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
import { Amount } from '@island.is/financial-aid/shared/lib'
import { DeductionFactorsModel } from '../../deductionFactors'

@Table({
  tableName: 'amount',
  timestamps: true,
})
export class AmountModel extends Model<Amount> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  aidAmount: number

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiProperty()
  income: number

  @ForeignKey(() => DeductionFactorsModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty()
  deductionFactorsId: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  personalTaxCredit: number

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiProperty()
  spousePersonalTaxCredit: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  tax: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  finalAmount: number

  @CreatedAt
  @ApiProperty()
  created: Date

  @UpdatedAt
  @ApiProperty()
  modified: Date
}
