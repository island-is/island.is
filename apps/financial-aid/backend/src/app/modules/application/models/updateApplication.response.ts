import { ApiProperty } from '@nestjs/swagger'

import { ApplicationModel } from './application.model'
import { ApplicationFilterResponse } from './applicationFilters.response'

export class UpdateApplicationResponse {
  @ApiProperty()
  application: ApplicationModel

  @ApiProperty()
  filters?: ApplicationFilterResponse
}
