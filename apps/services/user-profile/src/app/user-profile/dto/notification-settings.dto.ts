import { ApiProperty } from '@nestjs/swagger'

import { BlockedCategoryDto } from './blocked-category.dto'

export class NotificationSettingsDto {
  @ApiProperty({ description: 'National id of the user' })
  nationalId!: string

  @ApiProperty({ type: [BlockedCategoryDto] })
  blockedCategories!: BlockedCategoryDto[]
}
