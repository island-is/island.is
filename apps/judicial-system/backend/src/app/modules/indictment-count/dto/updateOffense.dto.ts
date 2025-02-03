import { IsEnum, IsObject, IsOptional } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import {
  IndictmentCountOffense,
  type SubstanceMap,
} from '@island.is/judicial-system/types'

export class UpdateOffenseDto {
  @IsEnum(IndictmentCountOffense)
  @ApiProperty({ enum: IndictmentCountOffense })
  readonly offense!: IndictmentCountOffense

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ type: Object })
  readonly substances?: SubstanceMap
}
