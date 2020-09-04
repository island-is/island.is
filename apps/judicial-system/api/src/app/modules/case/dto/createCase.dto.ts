import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { CaseState } from '../case.model'

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
  @IsEnum(CaseState)
  @ApiPropertyOptional({ enum: CaseState })
  readonly state: string
}
