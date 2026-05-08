import { IsEnum } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { AppealEventType } from '@island.is/judicial-system/types'

export class CreateAppealEventLogDto {
  @IsEnum(AppealEventType)
  @ApiProperty({ enum: AppealEventType })
  readonly eventType!: AppealEventType
}
