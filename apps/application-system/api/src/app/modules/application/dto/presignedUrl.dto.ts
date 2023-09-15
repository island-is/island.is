import { IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { PdfTypes } from '@island.is/application/types'

export class PresignedUrlDto {
  @IsEnum(PdfTypes)
  @ApiProperty({ enum: PdfTypes })
  readonly type!: PdfTypes
}
