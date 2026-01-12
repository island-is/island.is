import { IsObject, IsOptional } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import { type SubstanceMap } from '@island.is/judicial-system/types'

export class UpdateOffenseDto {
  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ type: Object })
  readonly substances?: SubstanceMap
}
