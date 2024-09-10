import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { DefenderChoice } from '@island.is/judicial-system/types'

export class UpdateSubpoenaDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false })
  acknowledged?: boolean

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  comment?: string

  @IsOptional()
  @IsEnum(DefenderChoice)
  @ApiProperty({ enum: DefenderChoice })
  defenderChoice?: DefenderChoice

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  defenderNationalId?: string
}
