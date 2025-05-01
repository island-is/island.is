import { IsEnum, IsNotEmpty, IsObject } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import type { User } from '@island.is/judicial-system/types'
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

  @IsNotEmpty()
  @IsObject()
  @ApiProperty({ type: Object })
  readonly user?: User
}
