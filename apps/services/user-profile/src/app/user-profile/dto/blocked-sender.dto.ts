import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator'

export const MAX_SENDERS_PER_REQUEST = 500

export class BlockedSenderDto {
  @ApiProperty({
    description: 'National id of the blocked notification sender',
    example: '1234567890',
  })
  senderId!: string
}

export class UpdateNotificationSenderDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'National id of the notification sender',
    example: '1234567890',
  })
  senderId!: string

  @IsBoolean()
  @ApiProperty({
    description:
      'True to block all notifications from the sender, false to unblock them',
  })
  blocked!: boolean
}
