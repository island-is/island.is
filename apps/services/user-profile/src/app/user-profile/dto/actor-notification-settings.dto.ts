import { ApiProperty } from '@nestjs/swagger'

import { BlockedCategoryDto } from './blocked-category.dto'

export class ActorNotificationSettingsDto {
  @ApiProperty({
    description: 'National id of the user that granted the delegation',
  })
  fromNationalId!: string

  @ApiProperty({ type: [BlockedCategoryDto] })
  blockedCategories!: BlockedCategoryDto[]

  @ApiProperty()
  onlyActionablePriorityNotifications!: boolean
}
