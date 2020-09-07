import { IsString, IsOptional, IsEnum, IsDate } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { CaseState } from '../case.model'

export class UpdateCaseDto {
  @IsOptional()
  @IsEnum(CaseState)
  @ApiPropertyOptional({ enum: CaseState })
  readonly state: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly policeCaseNumber: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
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
