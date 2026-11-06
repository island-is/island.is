import { ApiProperty } from '@nestjs/swagger'

export class ApplicationPdfResponseDto {
  @ApiProperty()
  base64!: string

  @ApiProperty()
  filename!: string
}
