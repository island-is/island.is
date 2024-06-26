import { ApiProperty } from '@nestjs/swagger'
import { InputDisplayOrderDto } from './inputDisplayOrder.dto'

export class UpdateInputsDisplayOrderDto {
  @ApiProperty({ type: [InputDisplayOrderDto] })
  inputsDisplayOrderDto!: InputDisplayOrderDto[]
}
