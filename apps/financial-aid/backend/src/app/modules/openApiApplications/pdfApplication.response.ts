import { ApiProperty } from '@nestjs/swagger'
import { IsBase64, IsNotEmpty } from 'class-validator'

export type Base64EncodedPdf = string & { readonly __brand: unique symbol }
export class PdfApplicationResponse {
  @ApiProperty({
    description: 'Base64 encoded PDF file',
    format: 'base64',
  })
  @IsNotEmpty()
  @IsBase64()
  file: Base64EncodedPdf
}
