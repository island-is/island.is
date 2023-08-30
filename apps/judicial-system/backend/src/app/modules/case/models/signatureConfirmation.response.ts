import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import type { SignatureConfirmationResponse as TSignatureConfirmationResponse } from '@island.is/judicial-system/types'

export class SignatureConfirmationResponse
  implements TSignatureConfirmationResponse
{
  @ApiProperty()
  documentSigned!: boolean

  @ApiPropertyOptional()
  code?: number

  @ApiPropertyOptional()
  message?: string
}
