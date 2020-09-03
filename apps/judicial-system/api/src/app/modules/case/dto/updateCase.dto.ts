import { IsString, IsOptional, IsEnum } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { CaseState } from '../case.model'

export class UpdateCaseDto {
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
  @IsEnum(CaseState)
  @ApiPropertyOptional({ enum: CaseState })
  readonly state: string
}
