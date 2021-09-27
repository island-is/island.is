import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { ApplicationState } from '@island.is/financial-aid/shared/lib'

export class UpdateApplicationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly state: ApplicationState

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  readonly amount: number

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly rejection: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  staffId: string

  @IsNotEmpty()
  @IsArray()
  @ApiProperty()
  applicationEventsId: [string]
}
