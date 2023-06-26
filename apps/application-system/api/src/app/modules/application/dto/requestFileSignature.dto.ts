import { IsEnum } from 'class-validator'
import { PdfTypes } from '@island.is/application/types'
import { ApiProperty } from '@nestjs/swagger'

export class RequestFileSignatureDto {
  @ApiProperty({ enum: PdfTypes })
  @IsEnum(PdfTypes)
  readonly type!: PdfTypes
}
