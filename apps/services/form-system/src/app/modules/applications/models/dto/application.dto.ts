import { ApiProperty } from '@nestjs/swagger'
import { ApplicationStep } from '../../../steps/models/dto/applicationStep.dto'

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

  @ApiProperty({ type: [ApplicationStep] })
  steps?: ApplicationStep[]
}
