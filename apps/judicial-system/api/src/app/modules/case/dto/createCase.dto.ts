import { IsNotEmpty, IsString, IsOptional } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateCaseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly policeCaseNumber: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly suspectNationalId: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly suspectName: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly suspectAddress: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly court: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly arrestDate: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly requestedCourtDate: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly requestedCustodyEndDate: Date
}
