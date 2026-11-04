import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import type { User } from '@island.is/judicial-system/types'
import { AppealCaseNotificationType } from '@island.is/judicial-system/types'

export class AppealCaseNotificationDto {
  @IsNotEmpty()
  @IsObject()
  @ApiProperty({ type: Object })
  readonly user!: User

  @IsNotEmpty()
  @IsEnum(AppealCaseNotificationType)
  @ApiProperty({ enum: AppealCaseNotificationType })
  readonly type!: AppealCaseNotificationType

  // The ids of the users that should receive the notification. Used to limit
  // recipients to a specific subset (e.g. only newly assigned appeal judges).
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({ type: String, isArray: true })
  readonly userIds?: string[]

  // The party a statement deadline notification is about: a defendant, a
  // civil claimant, or the prosecution when neither is named.
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly defendantId?: string

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly civilClaimantId?: string
}
