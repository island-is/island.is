import { SignatureResponse as TSignatureResponse } from '@island.is/judicial-system/types'
import { ApiProperty } from '@nestjs/swagger'

export class SignatureResponse implements TSignatureResponse {
  @ApiProperty()
  documentSigned: boolean

  @ApiProperty()
  code?: number

  @ApiProperty()
  message?: string
}
