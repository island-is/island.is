import { IsDate, IsOptional } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class UpdateDraftRegulationCancelDto {
  @IsOptional()
  @IsDate()
  @ApiProperty()
  date?: Date
}
