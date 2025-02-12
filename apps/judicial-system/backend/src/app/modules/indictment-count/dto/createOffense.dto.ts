import { IsEnum } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { IndictmentCountOffense } from '@island.is/judicial-system/types'

export class CreateOffenseDto {
  @IsEnum(IndictmentCountOffense)
  @ApiProperty({ enum: IndictmentCountOffense })
  readonly offense!: IndictmentCountOffense
}
