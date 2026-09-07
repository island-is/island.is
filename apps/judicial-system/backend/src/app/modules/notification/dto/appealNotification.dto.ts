import { IsEnum, IsNotEmpty } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { AppealCaseNotificationType } from '@island.is/judicial-system/types'

// Appeal case notifications that can be initiated directly from the frontend.
export enum UserInitiatedAppealNotificationType {
  APPEAL_CASE_FILES_UPDATED = AppealCaseNotificationType.APPEAL_CASE_FILES_UPDATED,
}

export class AppealNotificationDto {
  @IsNotEmpty()
  @IsEnum(UserInitiatedAppealNotificationType)
  @ApiProperty({ enum: UserInitiatedAppealNotificationType })
  readonly type!: UserInitiatedAppealNotificationType
}
