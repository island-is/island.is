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
import { DeductionFactors } from '@island.is/financial-aid/shared/lib'
import { AmountModel } from '../../amount/models/amount.model'

@Table({
  tableName: 'deductionFactors',
  timestamps: true,
})
export class DeductionFactorsModel extends Model<DeductionFactors> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id: string

  @ForeignKey(() => AmountModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty()
  amountId: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  description: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  @ApiProperty()
  amount: number

  @CreatedAt
  @ApiProperty()
  created: Date

  @UpdatedAt
  @ApiProperty()
  modified: Date
}
