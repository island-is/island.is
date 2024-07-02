import { ApiProperty } from '@nestjs/swagger'
import { ApplicationSection } from '../../../sections/models/dto/applicationSection.dto'

export class ApplicationDto {
  @ApiProperty()
  applicationId?: string

  @ApiProperty()
  organizationId?: string

  @ApiProperty()
  formId?: string

  @ApiProperty()
  formUrlName?: string

  @ApiProperty()
  created?: Date

  @ApiProperty()
  modified?: Date

  @ApiProperty({ type: [ApplicationSection] })
  sections?: ApplicationSection[]
}
