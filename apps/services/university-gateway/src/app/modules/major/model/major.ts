import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { DegreeType, InterestTag, Season } from '../types'
import { StudyType } from '../../application/types'
import { PageInfo } from './pageInfo'
import { CourseDetails } from '../../course/model'
import { MajorOtherField } from './majorOtherField'

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
    description:
      'Whether the major is active and should be displayed on the external web',
    example: true,
  })
  active!: boolean

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
    description: 'Cost for major (per year)',
    example: 75000,
  })
  @ApiPropertyOptional()
  costPerYear?: number

  @ApiProperty({
    description: 'ISCED code for major',
    example: '481',
  })
  iscedCode!: string

  @ApiProperty({
    description:
      'External url  for the major from the university web page (Icelandic)',
    example: 'https://www.ru.is/grunnnam/tolvunarfraedi',
  })
  @ApiPropertyOptional()
  externalUrlIs?: string

  @ApiProperty({
    description:
      'External url  for the major from the university web page (English)',
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

export class MajorDetails extends Major {
  @ApiProperty({
    description: 'Admission requirements for major (Icelandic)',
    example: 'Nemandinn verður að hafa klárað stúdentspróf',
  })
  @ApiPropertyOptional()
  admissionRequirementsIs?: string

  @ApiProperty({
    description: 'Admission requirements for major (English)',
    example: 'The student needs to have finished the matriculation exam',
  })
  @ApiPropertyOptional()
  admissionRequirementsEn?: string

  @ApiProperty({
    description: 'Study requirements for major (Icelandic)',
    example: 'Nemandinn verður að vera með lágmarkseinkunn 6 í öllum áföngum',
  })
  @ApiPropertyOptional()
  studyRequirementsIs?: string

  @ApiProperty({
    description: 'Study requirements for major (English)',
    example: 'The student must have a minimum grade of 6 in all courses',
  })
  @ApiPropertyOptional()
  studyRequirementsEn?: string

  @ApiProperty({
    description: 'Cost information for major (Icelandic)',
    example: 'Það verður að borga 10.000 kr staðfestingargjald fyrir 1. ágúst',
  })
  @ApiPropertyOptional()
  costInformationIs?: string

  @ApiProperty({
    description: 'Cost information for major (English)',
    example: 'A confirmation fee of ISK 10.000 must be paid before August 1',
  })
  @ApiPropertyOptional()
  costInformationEn?: string

  @ApiProperty({
    description: 'Column description for data',
    type: [CourseDetails],
  })
  courses!: CourseDetails[]

  @ApiProperty({
    description:
      'Other fields that should be displayed in the application for the major',
    type: [MajorOtherField],
  })
  otherFields?: [MajorOtherField]
}

export class MajorResponse {
  @ApiProperty({
    description: 'Major data',
    type: [Major],
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
    description: 'Major data',
    type: MajorDetails,
  })
  data!: MajorDetails
}
