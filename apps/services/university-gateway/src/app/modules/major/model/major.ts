import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, DataType, HasMany } from 'sequelize-typescript'
import { DegreeType, InterestTag, Season } from '../types'
import { StudyType } from '../../application/types'
import { PageInfo } from './pageInfo'

export class Major {
  @ApiProperty({
    description: 'Major ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  id!: string

  @ApiProperty({
    description: 'External ID for the major (from University)',
    example: 'ABC12345',
  })
  externalId!: string

  @ApiProperty({
    description: 'Major name (Icelandic)',
    example: 'Tölvunarfræði',
  })
  nameIs!: string

  @ApiProperty({
    description: 'Major name (English)',
    example: 'Computer science',
  })
  nameEn!: string

  @ApiProperty({
    description: 'University ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  universityId!: string

  @ApiProperty({
    description: 'Name of the department that the major belongs to (Icelandic)',
    example: 'Verkfræði og náttúruvísindasvið',
  })
  departmentNameIs!: string

  @ApiProperty({
    description: 'Name of the department that the major belongs to (English)',
    example: 'Engineering and Natural Sciences',
  })
  departmentNameEn!: string

  @ApiProperty({
    description: 'Which year this major started on',
    example: 2023,
  })
  startingSemesterYear!: number

  @ApiProperty({
    description: 'Which season this major started on',
    example: Season.FALL,
    enum: Season,
  })
  startingSemesterSeason!: Season

  @ApiProperty({
    description: 'When registration for this major opens',
    example: new Date('2023-05-01'),
  })
  registrationStart!: Date

  @ApiProperty({
    description: 'When registration for this major closes',
    example: new Date('2023-01-01'),
  })
  registrationEnd!: Date

  @ApiProperty({
    description: 'Degree type',
    example: DegreeType.UNDERGRADUATE,
    enum: DegreeType,
  })
  degreeType!: DegreeType

  @ApiProperty({
    description: 'Degree abbreviation',
    example: 'BSc',
  })
  degreeAbbreviation!: string

  @ApiProperty({
    description: 'Number of course credits (in ECTS)',
    example: 180,
  })
  credits!: number

  @ApiProperty({
    description: 'Major description (Icelandic)',
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  })
  @ApiPropertyOptional()
  descriptionIs?: string

  @ApiProperty({
    description: 'Major description (English)',
    example: 'Mauris a justo arcu. Orci varius natoque penatibus.',
  })
  @ApiPropertyOptional()
  descriptionEn?: string

  @ApiProperty({
    description: 'Total duration for this major (in years)',
    example: 3,
  })
  @ApiPropertyOptional()
  durationInYears?: number

  @ApiProperty({
    description: 'Price for major (per year)',
    example: 75000,
  })
  @ApiPropertyOptional()
  pricePerYear?: number

  @ApiProperty({
    description: 'ISCED code for major',
    example: '481',
  })
  iscedCode!: string

  @ApiProperty({
    description: 'External url for university web page (Icelandic)',
    example: 'https://www.ru.is/grunnnam/tolvunarfraedi/',
  })
  @ApiPropertyOptional()
  externalUrlIs?: string

  @ApiProperty({
    description: 'External url for university web page (English)',
    example: 'https://en.ru.is/st/dcs/undergraduate-study/bsc-computer-science',
  })
  @ApiPropertyOptional()
  externalUrlEn?: string

  @ApiProperty({
    description: 'Study types available for the major',
    example: [StudyType.ON_SITE],
    enum: StudyType,
    isArray: true,
  })
  studyTypes!: [StudyType]

  @ApiProperty({
    description:
      'Interest tag for the major (to be able to categorize majors after interest)',
    example: [InterestTag.ENGINEER],
    enum: InterestTag,
    isArray: true,
  })
  interestTags?: [InterestTag]
}

export class MajorDetails extends Major {}

export class MajorResponse {
  @ApiProperty({
    description: 'Column description for data',
    type: Major,
    isArray: true,
  })
  data!: Major[]

  @ApiProperty({
    description: 'Page information (for pagination)',
    type: PageInfo,
  })
  pageInfo!: PageInfo

  @ApiProperty({
    description: 'Total number of items in result (for pagination)',
    example: 25,
  })
  totalCount!: number
}

export class MajorDetailsResponse {
  @ApiProperty({
    description: 'Column description for data',
    type: MajorDetails,
  })
  data!: MajorDetails
}
