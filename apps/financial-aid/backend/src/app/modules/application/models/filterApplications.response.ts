import { ApiProperty } from '@nestjs/swagger'
import { ApplicationModel } from './application.model'
import { StaffModel } from '../../staff'

export class FilterApplicationsResponse {
  @ApiProperty()
  applications: ApplicationModel[]

  @ApiProperty()
  totalCount: number

  @ApiProperty()
  staffList: StaffModel[]
}
