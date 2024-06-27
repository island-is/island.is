import { ApiProperty } from '@nestjs/swagger'
import { PageDisplayOrderDto } from './pageDisplayOrder.dto'

export class UpdatePagesDisplayOrderDto {
  @ApiProperty({ type: [PageDisplayOrderDto] })
  pagesDisplayOrderDto!: PageDisplayOrderDto[]
}
