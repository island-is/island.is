import { IsNotEmpty, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class DeliverProsecutorToCourtDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  userId!: string
}
