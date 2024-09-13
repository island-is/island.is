import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreateCivilClaimantDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  readonly name!: string

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  readonly nationalId?: string

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  readonly defenderName?: string

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  readonly defenderEmail?: string

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  readonly defenderPhoneNumber?: string

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean })
  readonly caseFilesSharedWithDefender?: boolean
}
