import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class UpdateCivilClaimantDto {
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
  readonly spokespersonName?: string

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  readonly spokespersonEmail?: string

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  readonly spokespersonPhoneNumber?: string

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean })
  readonly caseFilesSharedWithSpokesperson?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean })
  readonly isLawyer?: boolean
}
