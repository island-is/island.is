import { IsNotEmpty, IsString, IsOptional, IsDate } from 'class-validator'
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
  @IsDate()
  @ApiPropertyOptional()
  readonly arrestDate: Date

  @IsOptional()
  @IsDate()
  @ApiPropertyOptional()
  readonly requestedCourtDate: Date
}
