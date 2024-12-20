import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ZendeskWebhookInputDto {
  @IsString()
  @ApiProperty()
  id!: string
}
