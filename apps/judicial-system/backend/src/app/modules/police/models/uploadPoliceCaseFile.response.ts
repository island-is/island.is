import { ApiProperty } from '@nestjs/swagger'

import type { UploadPoliceCaseFileResponse as TUploadPoliceCaseFileResponse } from '@island.is/judicial-system/types'

export class UploadPoliceCaseFileResponse
  implements TUploadPoliceCaseFileResponse {
  @ApiProperty({ nullable: true })
  key!: string
}
