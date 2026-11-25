import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class SendAppealVerdictToServiceDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  @ApiProperty({ type: String, isArray: true })
  readonly defendantIds!: string[]
}
