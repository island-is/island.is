import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { ApplicationState } from '@island.is/financial-aid/shared/lib'

export class FilterApplicationsDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly startDate!: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly endDate?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly state?: ApplicationState
}
