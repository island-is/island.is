import { ApiProperty } from '@nestjs/swagger'
import { ApplicationModel } from './application.model'

export class FilterApplicationsResponse {
  @ApiProperty()
  applications: ApplicationModel[]

  @ApiProperty()
  totalCount: number
}
