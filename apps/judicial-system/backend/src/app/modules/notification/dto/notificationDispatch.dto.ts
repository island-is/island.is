import { IsEnum, IsNotEmpty, IsObject, IsOptional } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import type { UserDescriptor } from '@island.is/judicial-system/types'
import {
  EventNotificationType,
  NotificationDispatchType,
} from '@island.is/judicial-system/types'

export class NotificationDispatchDto {
  @IsNotEmpty()
  @IsEnum(NotificationDispatchType)
  @ApiProperty({ enum: NotificationDispatchType })
  readonly type!: NotificationDispatchType
}

export class EventNotificationDispatchDto {
  @IsNotEmpty()
  @IsEnum(EventNotificationType)
  @ApiProperty({ enum: EventNotificationType })
  readonly type!: EventNotificationType

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ type: Object })
  readonly userDescriptor?: UserDescriptor
}
