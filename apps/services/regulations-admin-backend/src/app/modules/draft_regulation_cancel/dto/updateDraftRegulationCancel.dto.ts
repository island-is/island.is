import { IsOptional, IsString } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ISODate } from '@island.is/regulations'

export class UpdateDraftRegulationCancelDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  date?: ISODate
}
