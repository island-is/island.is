import { ApiProperty } from '@nestjs/swagger'
import { Application } from '../model/application'

export class ApplicationResponse {
  @ApiProperty({
    description: 'Application data',
    type: Application,
  })
  data!: Application
}
