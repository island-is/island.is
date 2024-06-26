import { ApiProperty } from '@nestjs/swagger'
import { StepDisplayOrderDto } from './stepDisplayOrder.dto'

export class UpdateStepsDisplayOrderDto {
  @ApiProperty({ type: [StepDisplayOrderDto] })
  stepsDisplayOrderDto!: StepDisplayOrderDto[]
}
