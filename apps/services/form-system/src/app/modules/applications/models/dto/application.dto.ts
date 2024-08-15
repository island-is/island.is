import { ApiPropertyOptional } from '@nestjs/swagger'
// import { ApplicationSectionDto } from '../../../sections/models/dto/applicationSection.dto'
import { OrganizationDto } from '../../../organizations/models/dto/organization.dto'
import { SectionDto } from '../../../sections/models/dto/section.dto'
// import { OrganizationsDto } from '../../../organizations/models/dto/organizations.dto'

export class ApplicationDto {
  @ApiPropertyOptional()
  id?: string

  @ApiPropertyOptional({ type: OrganizationDto })
  organization?: OrganizationDto

  @ApiPropertyOptional()
  formId?: string

  @ApiPropertyOptional()
  slug?: string

  @ApiPropertyOptional({ type: Date })
  created?: Date

  @ApiPropertyOptional({ type: Date })
  modified?: Date

  @ApiPropertyOptional({ type: [SectionDto] })
  sections?: SectionDto[]
}
