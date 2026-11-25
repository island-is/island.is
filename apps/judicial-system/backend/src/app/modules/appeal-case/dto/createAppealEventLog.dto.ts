import { IsEnum, IsOptional, IsUUID } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { AppealEventType } from '@island.is/judicial-system/types'

export class CreateAppealEventLogDto {
  @IsEnum(AppealEventType)
  @ApiProperty({ enum: AppealEventType })
  readonly eventType!: AppealEventType

  // Verdict-appeal statements are per party. When set, the event log is
  // scoped to this party instead of every party the defence user represents.
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly defendantId?: string

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly civilClaimantId?: string
}
