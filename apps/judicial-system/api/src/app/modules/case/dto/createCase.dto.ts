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
  readonly accusedNationalId: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly accusedName: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly accusedAddress: string

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
}
