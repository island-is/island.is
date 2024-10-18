import { ApiProperty } from '@nestjs/swagger'
import { OrganizationDto } from './organization.dto'

export class OrganizationsResponseDto {
  @ApiProperty({ type: [OrganizationDto] })
  organizations!: OrganizationDto[]
}
