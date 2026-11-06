import { ApiProperty } from '@nestjs/swagger'

import { BlockedCategoryDto } from './blocked-category.dto'

export class NotificationSettingsDto {
  @ApiProperty({ type: [BlockedCategoryDto] })
  blockedCategories!: BlockedCategoryDto[]
}
