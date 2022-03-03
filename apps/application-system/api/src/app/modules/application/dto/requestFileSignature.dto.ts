import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'

import { PdfTypes } from '@island.is/application/core'

export class RequestFileSignatureDto {
  @ApiProperty({ enum: PdfTypes })
  @IsEnum(PdfTypes)
  readonly type!: PdfTypes
}
