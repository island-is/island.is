import { ApiProperty } from '@nestjs/swagger'

import { ApplicationFilterResponse } from './applicationFilters.response'
import { ApplicationWithAttachments } from './application.model'

export class UpdateApplicationTableResponse {
  @ApiProperty()
  applications: ApplicationWithAttachments[]

  @ApiProperty()
  filters: ApplicationFilterResponse
}
