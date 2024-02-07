import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class FilterApplicationsDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly startDate!: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly endDate?: string
}
