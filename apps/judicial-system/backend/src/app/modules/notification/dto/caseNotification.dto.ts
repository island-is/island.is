import { IsEnum, IsNotEmpty, IsObject, IsOptional } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import type { User, UserDescriptor } from '@island.is/judicial-system/types'
import { UmbrellaNotificationType } from '@island.is/judicial-system/types'

export class CaseNotificationDto {
  // Notifications dispatched in response to logged events carry a
  // userDescriptor rather than a registered user - see below
  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ type: Object })
  readonly user?: User

  @IsNotEmpty()
  @IsEnum(UmbrellaNotificationType)
  @ApiProperty({ enum: UmbrellaNotificationType })
  readonly type!: UmbrellaNotificationType

  // notifications triggered from the event service don't always have the user object defined,
  // thus we include an optional sibling subtype of User to handle a minimal user info that
  // is requires in few notification methods
  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ type: Object })
  readonly userDescriptor?: UserDescriptor
}
