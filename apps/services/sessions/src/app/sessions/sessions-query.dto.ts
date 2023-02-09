import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

import { Order, PaginationDto } from '@island.is/nest/pagination'

export class SessionsQueryDto extends PaginationDto {
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Orders results by date. Defaults to descending order.',

    enum: Order,
    enumName: 'Order',
    default: Order.DESC,
  })
  order?: Order
}
