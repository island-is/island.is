import { ApiProperty } from '@nestjs/swagger'

import { ApplicationFilterResponse } from './applicationFilters.response'
import { ApplicationModel } from './application.model'

export class UpdateApplicationTableResponse {
  @ApiProperty()
  applications: ApplicationModel[]

  @ApiProperty()
  filters: ApplicationFilterResponse
}
