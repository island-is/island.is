import { IsNotEmpty, IsString, IsOptional } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import {
  Amount,
  ApplicationEventType,
  ApplicationState,
} from '@island.is/financial-aid/shared/lib'

export class UpdateApplicationDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly state: ApplicationState

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly event: ApplicationEventType

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly rejection?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly comment?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  staffId?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly spouseFormComment?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly spouseEmail?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly spousePhoneNumber?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly spouseName?: string

  @IsOptional()
  @ApiProperty()
  readonly amount?: Amount
}
