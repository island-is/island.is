import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import {
  AppealCaseNotificationType,
  RequestCaseNotificationType,
} from '@island.is/judicial-system/types'

export enum UserInitiatedNotificationType {
  APPEAL_CASE_FILES_UPDATED = AppealCaseNotificationType.APPEAL_CASE_FILES_UPDATED,
  CASE_FILES_UPDATED = RequestCaseNotificationType.CASE_FILES_UPDATED,
  COURT_DATE = RequestCaseNotificationType.COURT_DATE,
  HEADS_UP = RequestCaseNotificationType.HEADS_UP,
  READY_FOR_COURT = RequestCaseNotificationType.READY_FOR_COURT,
}

export class NotificationDto {
  @IsNotEmpty()
  @IsEnum(UserInitiatedNotificationType)
  @ApiProperty({ enum: UserInitiatedNotificationType })
  readonly type!: UserInitiatedNotificationType

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly eventOnly?: boolean

  // Generic key/value bag for notification-specific context. For appeal case
  // notifications (e.g. APPEAL_CASE_FILES_UPDATED) this must carry an
  // `appealCaseId` identifying which appeal case the notification is about.
  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ type: Object })
  readonly properties?: { [key: string]: string }
}
