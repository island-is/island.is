import { ApiProperty } from '@nestjs/swagger'
import { GroupDisplayOrderDto } from './groupDisplayOrder.dto'

export class UpdateGroupsDisplayOrderDto {
  @ApiProperty({ type: [GroupDisplayOrderDto] })
  groupsDisplayOrderDto!: GroupDisplayOrderDto[]
}
