import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import { DefenderChoice } from '@island.is/judicial-system/types'

export class UpdateSubpoenaDto {
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean, required: false })
  acknowledged?: boolean

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, required: false })
  comment?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, required: false })
  servedBy?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, required: false })
  servedAt?: string

  @IsOptional()
  @IsEnum(DefenderChoice)
  @ApiPropertyOptional({ enum: DefenderChoice, required: false })
  defenderChoice?: DefenderChoice

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, required: false })
  defenderNationalId?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean, required: false })
  prosecutedConfirmedSubpoenaThroughIslandis?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean, required: false })
  delivered?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean, required: false })
  deliveredOnPaper?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean, required: false })
  deliveredToLawyer?: boolean
}
