import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import {
  ApplicationEventType,
  ApplicationState,
} from '@island.is/financial-aid/shared/lib'

export class UpdateApplicationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly state: ApplicationState

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly event: ApplicationEventType

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
  readonly comment: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  staffId: string
}
