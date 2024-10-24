import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import { DefenderChoice, ServiceStatus } from '@island.is/judicial-system/types'

export class UpdateSubpoenaDto {
  @IsOptional()
  @IsEnum(ServiceStatus)
  @ApiPropertyOptional({ enum: ServiceStatus })
  readonly serviceStatus?: ServiceStatus

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly servedBy?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly serviceDate?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly comment?: string

  @IsOptional()
  @IsEnum(DefenderChoice)
  @ApiPropertyOptional({ enum: DefenderChoice })
  readonly defenderChoice?: DefenderChoice

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly defenderNationalId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly defenderName?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly defenderEmail?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly defenderPhoneNumber?: string

  @IsOptional()
  @IsEnum(DefenderChoice)
  @ApiPropertyOptional({ enum: DefenderChoice })
  readonly requestedDefenderChoice?: DefenderChoice

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly requestedDefenderNationalId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly requestedDefenderName?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly isDefenderChoiceConfirmed?: boolean
}
