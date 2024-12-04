import { IsEnum, IsNotEmpty } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { DefendantNotificationType } from '@island.is/judicial-system/types'

export class DefendantNotificationDto {
  @IsNotEmpty()
  @IsEnum(DefendantNotificationType)
  @ApiProperty({ enum: DefendantNotificationType })
  readonly type!: DefendantNotificationType
}
