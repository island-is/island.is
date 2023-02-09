import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsOptional } from 'class-validator'

import { Order, PaginationDto } from '@island.is/nest/pagination'

export class SessionsQueryDto extends PaginationDto {
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  from?: Date

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  to?: Date

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Orders results by date. Defaults to descending order.',

    enum: Order,
    enumName: 'Order',
    default: Order.DESC,
  })
  order?: Order
}
