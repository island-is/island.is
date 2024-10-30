import { IsBoolean, IsOptional, IsString } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateCivilClaimantDto {
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly noNationalId?: boolean

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly name?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly nationalId?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly hasSpokesperson?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly spokespersonIsLawyer?: boolean

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly spokespersonNationalId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly spokespersonName?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly spokespersonEmail?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly spokespersonPhoneNumber?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly caseFilesSharedWithSpokesperson?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly isSpokespersonConfirmed?: boolean
}
