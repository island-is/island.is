import { IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class DeleteFlightParams {
  @IsUUID()
  @ApiProperty()
  readonly flightId: string
}
