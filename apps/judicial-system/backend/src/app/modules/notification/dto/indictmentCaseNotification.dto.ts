import { IsEnum, IsNotEmpty, IsObject } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import {
  IndictmentCaseNotificationType,
  User,
} from '@island.is/judicial-system/types'

export class IndictmentCaseNotificationDto {
  @IsNotEmpty()
  @IsObject()
  @ApiProperty({ type: Object })
  readonly user?: User

  @IsNotEmpty()
  @IsEnum(IndictmentCaseNotificationType)
  @ApiProperty({ enum: IndictmentCaseNotificationType })
  readonly type!: IndictmentCaseNotificationType
}
