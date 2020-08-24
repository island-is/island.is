import { IsString, Length, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class DeleteFlightParams {
  @IsUUID()
  @ApiProperty()
  readonly flightId: string
}

export class CreateFlightParams {
  @IsString()
  @Length(8, 8)
  @ApiProperty()
  readonly discountCode: string
}
