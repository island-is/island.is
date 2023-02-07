import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsIn, IsOptional } from 'class-validator'

import { PaginationDto } from '@island.is/nest/pagination'

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
  @IsIn(['ASC', 'DESC'])
  @ApiPropertyOptional()
  order?: string
}
