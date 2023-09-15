import { IsOptional, IsString } from 'class-validator'
import { RegulationType } from '@island.is/regulations'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class CreateDraftRegulationDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly type?: RegulationType
}
