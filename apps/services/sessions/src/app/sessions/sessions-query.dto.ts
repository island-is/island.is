import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

import { PaginationDto } from '@island.is/nest/pagination'

export class SessionsQueryDto extends PaginationDto {
  @IsOptional()
  @ApiProperty({ required: false })
  order?: string
}
