import { Type } from 'class-transformer'
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import { ServiceStatus } from '@island.is/judicial-system/types'

export class PoliceUpdateVerdictDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date, nullable: true })
  serviceDate?: Date | null

  @IsOptional()
  @IsEnum(ServiceStatus)
  @ApiPropertyOptional({ enum: ServiceStatus })
  serviceStatus?: ServiceStatus

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  comment?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  servedBy?: string
}
