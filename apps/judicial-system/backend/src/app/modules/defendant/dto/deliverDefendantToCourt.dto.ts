import { IsNotEmpty, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class DeliverDefendantToCourtDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  userId!: string
}
