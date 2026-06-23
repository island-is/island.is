import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import type { User, UserDescriptor } from '@island.is/judicial-system/types'
import { UmbrellaNotificationType } from '@island.is/judicial-system/types'

export class CaseNotificationDto {
  @IsNotEmpty()
  @IsObject()
  @ApiProperty({ type: Object })
  readonly user!: User

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

  // The ids of the users that should receive the notification. Used to limit
  // recipients to a specific subset (e.g. only newly assigned appeal judges).
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({ type: String, isArray: true })
  readonly userIds?: string[]
}
