import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ValueType } from '../../../../dataTypes/valueTypes/valueType.model'
import { ApplicationEventDto } from '../../../applications/models/dto/applicationEvent.dto'

export class ValueDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  order!: number

  @ApiPropertyOptional({ type: ValueType })
  json?: ValueType

  @ApiPropertyOptional({ type: [ApplicationEventDto] })
  events?: ApplicationEventDto[]
}
