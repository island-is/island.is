import { IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class SendNotificationDto {
  @IsString()
  @ApiProperty()
  readonly nationalId: string
}
