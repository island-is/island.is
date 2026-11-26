import { IsIn, IsOptional, IsUUID } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { AppealEventType } from '@island.is/judicial-system/types'

// The events a user may record directly. The completion of a verdict appeal
// is recorded only by completing it, never written on its own.
const recordableAppealEventTypes = Object.values(AppealEventType).filter(
  (eventType) => eventType !== AppealEventType.APPEAL_COMPLETED,
)

export class CreateAppealEventLogDto {
  @IsIn(recordableAppealEventTypes)
  @ApiProperty({ enum: recordableAppealEventTypes })
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
