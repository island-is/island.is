import { Type } from 'class-transformer'
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import type { User } from '@island.is/judicial-system/types'
import {
  AppealCaseNotificationType,
  AppealCourtSessionType,
} from '@island.is/judicial-system/types'

// A session as it stood when it was cancelled. The row is gone by the time
// the message runs, so the mail about it has to be told what it was.
export class AppealCourtSessionNotificationDto {
  @IsEnum(AppealCourtSessionType)
  @ApiProperty({ enum: AppealCourtSessionType })
  readonly sessionType!: AppealCourtSessionType

  @Type(() => Date)
  @IsDate()
  @ApiProperty({ type: Date })
  readonly sessionDate!: Date

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  readonly courtRoom!: string
}

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

  // The court session the notification is about, for the session types.
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly appealCourtSessionId?: string

  // The session a cancellation notification is about.
  @IsOptional()
  @ValidateNested()
  @Type(() => AppealCourtSessionNotificationDto)
  @ApiPropertyOptional({ type: AppealCourtSessionNotificationDto })
  readonly appealCourtSession?: AppealCourtSessionNotificationDto

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
