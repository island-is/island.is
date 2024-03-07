import { Column, DataType, Model, Table } from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

import { DeductionFactors } from '@island.is/financial-aid/shared/lib'

@Table({
  tableName: 'deductionFactors',
  timestamps: true,
})
export class DeductionFactorsBackendModel extends Model<DeductionFactors> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  description!: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  @ApiProperty()
  amount!: number
}
