import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator'
import { ModeOfDelivery } from '../../program/types'
import { ApplicationStatus } from '../../application/types'

export class UpdateApplicationDto {
  @IsEnum(ApplicationStatus)
  @ApiProperty({
    description: 'Application status',
    example: ApplicationStatus.ACCEPTED_BY_UNIVERSITY_AND_STUDENT,
    enum: ApplicationStatus,
  })
  status!: ApplicationStatus
}
