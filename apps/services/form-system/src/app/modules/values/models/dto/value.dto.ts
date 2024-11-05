import { ApiProperty } from '@nestjs/swagger'
import { Sequelize } from 'sequelize'
// import { BaseValueType } from '../../../../dataTypes/valueTypes/baseValueType.interface'
import { ValueType } from '../../../../dataTypes/valueTypes/valueType.model'

export class ValueDto {
  @ApiProperty()
  id!: string

  // @ApiProperty({ type: Sequelize.json })
  // json?: object

  @ApiProperty()
  order!: number

  @ApiProperty({ type: ValueType })
  json?: ValueType
}
