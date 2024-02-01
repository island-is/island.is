import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class SignatureConfirmationResponse {
  @ApiProperty()
  documentSigned!: boolean

  @ApiPropertyOptional()
  code?: number

  @ApiPropertyOptional()
  message?: string
}
