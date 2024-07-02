import { ApiProperty } from '@nestjs/swagger'
import { ListItemDisplayOrderDto } from './listItemDisplayOrder.dto'

export class UpdateListItemsDisplayOrderDto {
  @ApiProperty({ type: [ListItemDisplayOrderDto] })
  listItemsDisplayOrderDto!: ListItemDisplayOrderDto[]
}
