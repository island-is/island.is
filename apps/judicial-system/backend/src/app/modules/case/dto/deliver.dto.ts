import { IsNotEmpty, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class DeliverDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  userId!: string
}
