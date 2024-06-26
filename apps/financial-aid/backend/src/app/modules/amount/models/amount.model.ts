import {
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
import { Amount } from '@island.is/financial-aid/shared/lib'
import { DeductionFactorsModel } from '../../deductionFactors/models/deductionFactors.model'
import { ApplicationModel } from '../../application/models/application.model'

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

  @ForeignKey(() => ApplicationModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty()
  applicationId: string

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

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiProperty()
  childrenAidAmount: number

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiProperty()
  decemberAidAmount: number

  @HasMany(() => DeductionFactorsModel, 'amountId')
  @ApiProperty({ type: DeductionFactorsModel, isArray: true })
  deductionFactors?: DeductionFactorsModel[]

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
