import { IsObject, IsOptional } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateApplicationDto {
  @IsOptional()
  @IsObject()
  @ApiPropertyOptional()
  readonly answers?: object

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional()
  readonly draftProgress?: {
    stepsFinished: number
    totalSteps: number
  }
}
