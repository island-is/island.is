import { ApiProperty } from '@nestjs/swagger'
import { OrganizationDto } from './organization.dto'
// import { OrganizationsDto } from './organizations.dto'

export class OrganizationsResponse {
  @ApiProperty({ type: [OrganizationDto] })
  organizations!: OrganizationDto[]
}
