import { IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'
import { ISODate } from '@island.is/regulations'

export class UpdateDraftRegulationCancelDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  date?: ISODate
}
