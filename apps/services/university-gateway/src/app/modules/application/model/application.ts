import { ApiProperty } from '@nestjs/swagger'
import { Column, DataType } from 'sequelize-typescript'
import { StudyType, ApplicationStatus } from '../types'

export class Application {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for id',
    example: 'Example value for id',
  })
  id!: string

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for university id',
    example: 'Example value for university id',
  })
  universityId!: string

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for major id',
    example: 'Example value for major id',
  })
  majorId!: string

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(StudyType),
  })
  @ApiProperty({
    description: 'Column description for study type',
    example: StudyType.ON_SITE,
    enum: StudyType,
  })
  studyType!: StudyType

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(ApplicationStatus),
  })
  @ApiProperty({
    description: 'Column description for status',
    example: ApplicationStatus.IN_REVIEW,
    enum: ApplicationStatus,
  })
  status!: ApplicationStatus
}

export class ApplicationResponse {
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for data',
    type: Application,
  })
  data!: Application
}
