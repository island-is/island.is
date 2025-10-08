import { IsBoolean, IsOptional, IsUUID } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

export class CreateVerdictDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  defendantId?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  isDefaultJudgement?: boolean
}
