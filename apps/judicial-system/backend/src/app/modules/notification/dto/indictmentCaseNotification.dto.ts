import { IsEnum, IsNotEmpty } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { IndictmentCaseNotificationType } from '@island.is/judicial-system/types'

export class IndictmentCaseNotificationDto {
  @IsNotEmpty()
  @IsEnum(IndictmentCaseNotificationType)
  @ApiProperty({ enum: IndictmentCaseNotificationType })
  readonly type!: IndictmentCaseNotificationType
}
