import { IsEnum, IsNotEmpty } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { RequestCaseNotificationType } from '@island.is/judicial-system/types'

export enum UserInitiatedNotificationType {
  ADVOCATE_ASSIGNED = RequestCaseNotificationType.ADVOCATE_ASSIGNED,
  CASE_FILES_UPDATED = RequestCaseNotificationType.CASE_FILES_UPDATED,
  HEADS_UP = RequestCaseNotificationType.HEADS_UP,
  READY_FOR_COURT = RequestCaseNotificationType.READY_FOR_COURT,
}

export class NotificationDto {
  @IsNotEmpty()
  @IsEnum(UserInitiatedNotificationType)
  @ApiProperty({ enum: UserInitiatedNotificationType })
  readonly type!: UserInitiatedNotificationType
}
