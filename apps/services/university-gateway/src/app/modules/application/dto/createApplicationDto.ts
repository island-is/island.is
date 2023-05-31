import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator'
import { StudyType } from '../types'

export class CreateApplicationDto {
  @IsUUID()
  @ApiProperty({
    description: 'University ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  universityId!: string

  @IsUUID()
  @ApiProperty({
    description: 'Major ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  majorId!: string

  @IsEnum(StudyType)
  @ApiProperty({
    description: 'What kind of study type was selected in the application',
    example: StudyType.ON_SITE,
    enum: StudyType,
  })
  studyType!: StudyType

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Extra data that should follow application',
    example: 'TBD',
  })
  @ApiPropertyOptional()
  extraData?: string
}
