import { ApiProperty } from '@nestjs/swagger'

import { ApplicationFilters } from '@island.is/financial-aid/shared/lib'
import { ApplicationModel } from './application.model'

export class UpdateApplicationResponse {
  @ApiProperty()
  application: ApplicationModel

  @ApiProperty()
  filters?: ApplicationFilters
}
