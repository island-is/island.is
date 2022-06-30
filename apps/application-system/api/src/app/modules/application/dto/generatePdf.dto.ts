import { IsEnum } from 'class-validator'
import { PdfTypes } from '@island.is/application/core'
import { ApiProperty } from '@nestjs/swagger'

export class GeneratePdfDto {
  @ApiProperty({ enum: PdfTypes })
  @IsEnum(PdfTypes)
  readonly type!: PdfTypes
}
