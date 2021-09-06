import { ApiProperty } from '@nestjs/swagger'

import type { DeleteFileResponse as TDeleteFileResponse } from '@island.is/judicial-system/types'

export class DeleteFileResponse implements TDeleteFileResponse {
  @ApiProperty()
  success!: boolean
}
