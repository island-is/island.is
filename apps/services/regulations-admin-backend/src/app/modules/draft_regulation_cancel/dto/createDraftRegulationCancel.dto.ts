import { IsDate, IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreateDraftRegulationCancelDto {
  @IsString()
  @ApiProperty()
  regulation!: string

  @IsDate()
  @IsOptional()
  @ApiProperty()
  date?: Date
}
