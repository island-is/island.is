import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { ApplicationState } from '@island.is/financial-aid/shared/lib'

export class FilterApplicationsDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Format: 2024-02-22 - year-month-date',
  })
  readonly startDate!: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Format: 2024-02-22 - year-month-date',
  })
  readonly endDate?: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'States are:  New, InProgress, DataNeeded, Rejected, Approved',
  })
  readonly state?: ApplicationState
}
