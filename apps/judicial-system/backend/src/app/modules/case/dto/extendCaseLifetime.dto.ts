import { IsInt, Max, Min } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class ExtendCaseLifetimeDto {
  // Counted from today. Zero removes an extension.
  @IsInt()
  @Min(0)
  @Max(3650)
  @ApiProperty({ type: Number })
  readonly days!: number
}
