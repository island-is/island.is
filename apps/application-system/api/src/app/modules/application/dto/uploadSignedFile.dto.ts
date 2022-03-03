import { ApiProperty } from '@nestjs/swagger'
import { IsEnum,IsString } from 'class-validator'

import { PdfTypes } from '@island.is/application/core'

export class UploadSignedFileDto {
  @IsString()
  @ApiProperty()
  readonly documentToken!: string

  @IsEnum(PdfTypes)
  @ApiProperty({ enum: PdfTypes })
  readonly type!: PdfTypes
}
