import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsString, IsUUID } from 'class-validator'
import { Season } from '../../major/types'

export class CreateCourseDto {
  @IsString()
  @ApiProperty({
    description: 'External ID for the course (from University)',
    example: 'ABC12345',
  })
  externalId!: string

  @IsString()
  @ApiProperty({
    description: 'Course name (Icelandic)',
    example: 'Tölvunarfræði I',
  })
  nameIs!: string

  @IsString()
  @ApiProperty({
    description: 'Course name (English)',
    example: 'Computer science I',
  })
  nameEn!: string

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

  @IsNumber()
  @ApiProperty({
    description: 'Number of course credits (in ECTS)',
    example: 8,
  })
  credits!: number

  @IsNumber()
  @ApiProperty({
    description: 'Which year this course is taught on',
    example: 2023,
  })
  semesterYear!: number

  @IsEnum(Season)
  @ApiProperty({
    description: 'Which season this course is taught on',
    example: Season.FALL,
    enum: Season,
  })
  semesterSeason!: Season
}
