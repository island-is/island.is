import { ApiProperty } from '@nestjs/swagger'

import type { UploadFileToCourtResponse as TUploadFileToCourtResponse } from '@island.is/judicial-system/types'

export class UploadFileToCourtResponse implements TUploadFileToCourtResponse {
  @ApiProperty()
  success!: boolean
}
