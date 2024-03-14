import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsOptional, IsString, Length } from 'class-validator'

import { Order, PaginationDto } from '@island.is/nest/pagination'

export class SessionsQueryDto extends PaginationDto {
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Only return sessions from this date.',
  })
  from?: Date

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Only return sessions to this date.',
  })
  to?: Date

  @IsOptional()
  @IsString()
  @Length(2, 2)
  @ApiPropertyOptional({
    description:
      'Only return sessions originating from this country code (see: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).',
  })
  ipLocation?: string

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Orders results by date. Defaults to descending order.',

    enum: Order,
    enumName: 'Order',
    default: Order.DESC,
  })
  order?: Order
}
