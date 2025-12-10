import { IsDate, IsOptional } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

export class DateFilter {
  @IsOptional()
  @IsDate()
  @ApiPropertyOptional()
  readonly fromDate?: Date

  @IsOptional()
  @IsDate()
  @ApiPropertyOptional()
  readonly toDate?: Date
}
