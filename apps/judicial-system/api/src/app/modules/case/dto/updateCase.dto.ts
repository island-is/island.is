import { IsString, IsOptional, IsEnum } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { CaseState } from '../case.model'

export class UpdateCaseDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly description: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly policeCaseNumber: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly suspectNationalId: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly suspectName: string

  @IsOptional()
  @IsEnum(CaseState)
  @ApiPropertyOptional({ enum: CaseState })
  readonly state: string
}
