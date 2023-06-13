import { ApiProperty } from '@nestjs/swagger'
import { ApplicationStatus } from '../../application/types'

export class ExampleApplicationStatus {
  @ApiProperty({
    description: 'Application status',
    example: ApplicationStatus.IN_REVIEW,
    enum: ApplicationStatus,
  })
  status!: ApplicationStatus
}

export class ExampleApplicationStatusResponse {
  @ApiProperty({
    description: 'Application status data',
    type: ExampleApplicationStatus,
  })
  data!: ExampleApplicationStatus
}
