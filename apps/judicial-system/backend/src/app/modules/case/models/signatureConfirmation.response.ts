import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class SignatureConfirmationResponse {
  @ApiProperty({ type: Boolean })
  documentSigned!: boolean

  @ApiPropertyOptional({ type: Number })
  code?: number

  @ApiPropertyOptional({ type: String })
  message?: string
}
