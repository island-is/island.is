import { ApiProperty } from '@nestjs/swagger'
import { ApplicationSectionDto } from '../../../sections/models/dto/applicationSection.dto'
import { OrganizationDto } from '../../../organizations/models/dto/organization.dto'

export class ApplicationDto {
  @ApiProperty()
  applicationId?: string

  @ApiProperty()
  organization?: OrganizationDto

  @ApiProperty()
  formId?: string

  @ApiProperty()
  formUrlName?: string

  @ApiProperty()
  created?: Date

  @ApiProperty()
  modified?: Date

  @ApiProperty({ type: [ApplicationSectionDto] })
  sections?: ApplicationSectionDto[]
}
