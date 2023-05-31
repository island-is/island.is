import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, DataType } from 'sequelize-typescript'
import { Season } from '../../major/types'
import { PageInfo } from '../../major/model/pageInfo'

export class Course {
  @ApiProperty({
    description: 'Course ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  id!: string

  @ApiProperty({
    description: 'External ID for the course (from University)',
    example: 'ABC12345',
  })
  externalId!: string

  @ApiProperty({
    description: 'Course name (Icelandic)',
    example: 'Tölvunarfræði I',
  })
  nameIs!: string

  @ApiProperty({
    description: 'Course name (English)',
    example: 'Computer science I',
  })
  nameEn!: string

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
    description: 'Number of course credits (in ECTS)',
    example: 8,
  })
  credits!: number

  @ApiProperty({
    description: 'Which year this course is taught on',
    example: 2023,
  })
  semesterYear!: number

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(Season),
  })
  @ApiProperty({
    description: 'Which season this course is taught on',
    example: Season.FALL,
    enum: Season,
  })
  semesterSeason!: Season
}

export class CourseDetails extends Course {}

export class CourseResponse {
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Course data',
    type: Course,
    isArray: true,
  })
  data!: Course[]

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Page information (for pagination)',
    type: PageInfo,
  })
  pageInfo!: PageInfo

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Total number of items in result (for pagination)',
    example: 25,
  })
  totalCount!: number
}

export class CourseDetailsResponse {
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Course data',
    type: CourseDetails,
  })
  data!: CourseDetails
}
