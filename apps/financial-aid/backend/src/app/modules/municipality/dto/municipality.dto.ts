import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { Municipality } from '@island.is/financial-aid/types'

export class MunicipalityQueryInput {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly id!: string
}
