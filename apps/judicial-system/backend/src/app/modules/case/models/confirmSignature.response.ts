import { ApiProperty } from '@nestjs/swagger'

import { ConfirmSignatureResponse as TConfirmSignatureResponse } from '@island.is/judicial-system/types'

export class ConfirmSignatureResponse implements TConfirmSignatureResponse {
  @ApiProperty()
  documentSigned: boolean

  @ApiProperty()
  code?: number

  @ApiProperty()
  message?: string
}
