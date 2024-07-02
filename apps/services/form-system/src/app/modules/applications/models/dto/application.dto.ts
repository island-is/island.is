import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ApplicationSectionDto } from '../../../sections/models/dto/applicationSection.dto'
import { OrganizationDto } from '../../../organizations/models/dto/organization.dto'

export class ApplicationDto {
  @ApiPropertyOptional()
  applicationId?: string

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

  @ApiPropertyOptional({ type: [ApplicationSectionDto] })
  sections?: ApplicationSectionDto[]
}
