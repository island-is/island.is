import { ApiProperty } from '@nestjs/swagger'

import { ApplicationFilters } from '@island.is/financial-aid/shared/lib'
import { ApplicationModel } from './application.model'

export class UpdateApplicationTableResponse {
  @ApiProperty()
  applications: ApplicationModel[]

  @ApiProperty()
  filters: ApplicationFilters
}
