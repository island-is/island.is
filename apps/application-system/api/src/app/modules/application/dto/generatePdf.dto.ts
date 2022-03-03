import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'

import { PdfTypes } from '@island.is/application/core'

export class GeneratePdfDto {
  @ApiProperty({ enum: PdfTypes })
  @IsEnum(PdfTypes)
  readonly type!: PdfTypes
}
