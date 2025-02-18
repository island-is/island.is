import { ValueType } from '@island.is/form-system-dataTypes'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ApplicationEventDto } from './applicationEvent.dto'

export class ValueDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  order!: number

  @ApiPropertyOptional({ type: ValueType })
  json?: ValueType

  @ApiProperty({ type: [ApplicationEventDto] })
  events?: ApplicationEventDto[]
}
