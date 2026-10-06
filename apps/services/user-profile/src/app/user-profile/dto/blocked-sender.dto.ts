import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class BlockedSenderDto {
  @ApiProperty({
    description: 'National id of the blocked notification sender',
    example: '1234567890',
  })
  senderId!: string
}

export class CreateBlockedSenderDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'National id of the notification sender to block',
    example: '1234567890',
  })
  senderId!: string
}
