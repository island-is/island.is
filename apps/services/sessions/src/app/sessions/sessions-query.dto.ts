import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

import { PaginationDto } from '@island.is/nest/pagination'

export class SessionsQueryDto extends PaginationDto {
  @IsOptional()
  @ApiPropertyOptional()
  order?: string
}
