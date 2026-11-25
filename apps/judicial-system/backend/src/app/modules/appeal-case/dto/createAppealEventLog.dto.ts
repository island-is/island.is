import { IsIn } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

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
}
