import { IsObject, IsOptional, IsString } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import { DateFilter } from './types'

export class RequestStatisticsDto {
  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ type: () => DateFilter })
  readonly created?: DateFilter

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ type: () => DateFilter })
  readonly sentToCourt?: DateFilter

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly institutionId?: string
}
