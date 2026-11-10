import { ApiProperty } from '@nestjs/swagger'

import { BlockedCategoryDto } from './blocked-category.dto'
import { BlockedSenderDto } from './blocked-sender.dto'

export class NotificationSettingsDto {
  @ApiProperty({ description: 'National id of the user' })
  nationalId!: string

  @ApiProperty({ type: [BlockedCategoryDto] })
  blockedCategories!: BlockedCategoryDto[]

  @ApiProperty({ type: [BlockedSenderDto] })
  blockedSenders!: BlockedSenderDto[]
}
