import { ApiProperty } from '@nestjs/swagger'
import { ApplicationStatus } from '../../application/types'

export class ExampleApplication {
  @ApiProperty({
    description: 'Application status',
    example: ApplicationStatus.IN_REVIEW,
    enum: ApplicationStatus,
  })
  status!: ApplicationStatus
}

export class ExampleApplicationResponse {
  @ApiProperty({
    description: 'Application status data',
    type: ExampleApplication,
  })
  data!: ExampleApplication
}
