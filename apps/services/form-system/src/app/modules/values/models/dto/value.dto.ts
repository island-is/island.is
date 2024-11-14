import { ApiProperty } from '@nestjs/swagger'
import { ValueType } from '../../../../dataTypes/valueTypes/valueType.model'

export class ValueDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  order!: number

  @ApiProperty({ type: ValueType })
  json?: ValueType
}
