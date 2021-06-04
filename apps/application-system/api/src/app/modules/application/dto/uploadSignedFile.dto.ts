import { IsString, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { PdfTypes } from '@island.is/application/core'

export class UploadSignedFileDto {
  @IsString()
  @ApiProperty()
  readonly documentToken!: string

  @IsEnum(PdfTypes)
  @ApiProperty({ enum: PdfTypes })
  readonly type!: PdfTypes
}
