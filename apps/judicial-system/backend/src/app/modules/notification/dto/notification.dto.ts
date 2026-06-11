import { IsBoolean, IsEnum, IsNotEmpty, IsOptional } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import {
  AppealCaseNotificationType,
  IndictmentCaseNotificationType,
  RequestCaseNotificationType,
} from '@island.is/judicial-system/types'

export enum UserInitiatedNotificationType {
  APPEAL_CASE_FILES_UPDATED = AppealCaseNotificationType.APPEAL_CASE_FILES_UPDATED,
  CASE_FILES_UPDATED = RequestCaseNotificationType.CASE_FILES_UPDATED,
  COURT_DATE = RequestCaseNotificationType.COURT_DATE,
  HEADS_UP = RequestCaseNotificationType.HEADS_UP,
  READY_FOR_COURT = RequestCaseNotificationType.READY_FOR_COURT,
  RULING_ORDER_ADDED = IndictmentCaseNotificationType.RULING_ORDER_ADDED,
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
}
