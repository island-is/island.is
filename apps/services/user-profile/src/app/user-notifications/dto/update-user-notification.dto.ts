import { PartialType } from '@nestjs/mapped-types'
import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'
import { UserNotificationDto } from './user-notification.dto'

export class UpdateUserNotificationDto extends PartialType(
  UserNotificationDto,
) {
  @ApiProperty({ required: true, example: false })
  @IsBoolean()
  isEnabled!: boolean
}
