import { IsEnum, IsNotEmpty, IsObject, IsOptional } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import type { User, UserDescriptor } from '@island.is/judicial-system/types'
import { CaseNotificationType } from '@island.is/judicial-system/types'

export class CaseNotificationDto {
  @IsNotEmpty()
  @IsObject()
  @ApiProperty({ type: Object })
  readonly user!: User

  @IsNotEmpty()
  @IsEnum(CaseNotificationType)
  @ApiProperty({ enum: CaseNotificationType })
  readonly type!: CaseNotificationType

  // notifications triggered from the event service don't always have the user object defined,
  // thus we include an optional sibling subtype of User to handle a minimal user info that
  // is requires in few notification methods
  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ type: Object })
  readonly userDescriptor?: UserDescriptor
}
