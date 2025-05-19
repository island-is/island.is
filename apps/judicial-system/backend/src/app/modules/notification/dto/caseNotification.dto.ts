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
  // thus we include an optional sibling subtype of User since we can't fully rely on the
  // type inference between the event notification dispatcher and case notification controllers during compile time
  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ type: Object })
  readonly userDescriptor?: UserDescriptor
}
