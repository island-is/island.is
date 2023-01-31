import { IsString, IsOptional } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateIndictmentCountDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly policeCaseNumber?: string
}
