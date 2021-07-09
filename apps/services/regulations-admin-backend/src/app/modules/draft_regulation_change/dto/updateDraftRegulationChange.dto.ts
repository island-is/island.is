import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class UpdateDraftRegulationChangeDto {
  @IsOptional()
  @IsDate()
  @ApiProperty()
  date?: Date

  @IsOptional()
  @IsString()
  @ApiProperty()
  title?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  text?: string
}
