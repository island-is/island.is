import { IsOptional, IsString } from 'class-validator'
import { RegulationType } from '@island.is/regulations'
import { ApiProperty } from '@nestjs/swagger'

export class CreateDraftRegulationDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly type?: RegulationType
}
