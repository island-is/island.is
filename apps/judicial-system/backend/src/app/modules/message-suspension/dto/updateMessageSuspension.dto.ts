import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateMessageSuspensionDto {
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly suspended?: boolean

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({ type: Number })
  readonly delaySeconds?: number
}
