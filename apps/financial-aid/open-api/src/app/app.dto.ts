import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class FilterApplicationsDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly startDate?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly endDate?: string
}
