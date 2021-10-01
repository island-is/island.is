import { ApiProperty } from '@nestjs/swagger'

import { ApplicationModel } from './application.model'
import { ApplicationFilterModel } from './applicationFilters.response'

export class UpdateApplicationResponse {
  @ApiProperty()
  application: ApplicationModel

  @ApiProperty()
  filters?: ApplicationFilterModel
}
