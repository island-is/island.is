import { IsNotEmpty, IsString, IsOptional } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { ApplicationState } from '@island.is/financial-aid/shared'

export class CreateApplicationEventDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly applicationId: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly state: ApplicationState

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly comment: string
}
