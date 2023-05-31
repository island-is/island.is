import { ApiProperty } from '@nestjs/swagger'
import { Column, DataType } from 'sequelize-typescript'
import { StudyType, ApplicationStatus } from '../types'

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
    description: 'Major ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  majorId!: string

  @ApiProperty({
    description: 'What kind of study type was selected in the application',
    example: StudyType.ON_SITE,
    enum: StudyType,
  })
  studyType!: StudyType

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
