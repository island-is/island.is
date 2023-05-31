import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator'
import { StudyType } from '../types'

export class CreateApplicationDto {
  @IsUUID()
  @ApiProperty({
    description: 'Column description for university id',
    example: 'Example value for university id',
  })
  universityId!: string

  @IsUUID()
  @ApiProperty({
    description: 'Column description for major id',
    example: 'Example value for major id',
  })
  majorId!: string

  @IsEnum(StudyType)
  @ApiProperty({
    description: 'Column description for study type',
    example: StudyType.ON_SITE,
    enum: StudyType,
  })
  studyType!: StudyType

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Column description for extra data',
    example: 'Example value for extra data',
  })
  @ApiPropertyOptional()
  extraData?: string
}
