import { ApplicationStatus } from '@island.is/university-gateway'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'

export class UpdateApplicationDto {
  @IsEnum(ApplicationStatus)
  @ApiProperty({
    description: 'Application status',
    example: ApplicationStatus.IN_REVIEW,
    enum: ApplicationStatus,
  })
  status!: ApplicationStatus

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Extra data that should follow application',
    example: 'TBD',
  })
  @ApiPropertyOptional()
  extraData?: string
}
