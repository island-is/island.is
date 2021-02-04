import { IsEnum } from 'class-validator'
import { PdfTypes } from '@island.is/application/core'
import { ApiProperty } from '@nestjs/swagger'

export class CreatePdfDto {
  @ApiProperty({ enum: PdfTypes })
  @IsEnum(PdfTypes)
  readonly type!: PdfTypes
}
