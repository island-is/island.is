import { IsOptional, IsString } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

export class CreateSubpoenaDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly subpoenaId?: string
}
