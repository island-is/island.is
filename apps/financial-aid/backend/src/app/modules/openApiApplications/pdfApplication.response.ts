import { ApiProperty } from '@nestjs/swagger'

export class PdfApplicatiponResponse {
  @ApiProperty()
  file: string
}
