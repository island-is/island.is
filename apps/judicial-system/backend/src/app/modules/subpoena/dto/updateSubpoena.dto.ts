import { IsBoolean, IsOptional, IsString } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateSubpoenaDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly subpoenaId?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly acknowledged?: boolean

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly comment?: string
}
