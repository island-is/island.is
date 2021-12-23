import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateNotificationResponse {
  @ApiProperty()
  @IsString()
  id!: string
}
