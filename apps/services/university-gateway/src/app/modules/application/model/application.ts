import { ApiProperty } from '@nestjs/swagger'
import { ApplicationStatus } from '../types'
import { ModeOfDelivery } from '../../program/types'

export class Application {
  @ApiProperty({
    description: 'Application ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  id!: string

  @ApiProperty({
    description: 'University ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  universityId!: string

  @ApiProperty({
    description: 'Program ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  programId!: string

  @ApiProperty({
    description: 'What mode of delivery was selected in the application',
    example: ModeOfDelivery.ON_SITE,
    enum: ModeOfDelivery,
  })
  modeOfDelivery!: ModeOfDelivery

  @ApiProperty({
    description: 'Application status',
    example: ApplicationStatus.IN_REVIEW,
    enum: ApplicationStatus,
  })
  status!: ApplicationStatus
}

export class ApplicationResponse {
  @ApiProperty({
    description: 'Application data',
    type: Application,
  })
  data!: Application
}
