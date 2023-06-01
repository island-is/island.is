import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'
import { DegreeType, InterestTag, Season, StudyType } from '../types'
import { CreateCourseDto } from '../../course/dto'
import { MajorOtherFieldDto } from './majorOtherFieldDto'

export class CreateMajorDto {
  @IsString()
  @ApiProperty({
    description: 'External ID for the major (from University)',
    example: 'ABC12345',
  })
  externalId!: string

  @IsString()
  @ApiProperty({
    description: 'Major name (Icelandic)',
    example: 'Tölvunarfræði',
  })
  nameIs!: string

  @IsString()
  @ApiProperty({
    description: 'Major name (English)',
    example: 'Computer science',
  })
  nameEn!: string

  @IsUUID()
  @ApiProperty({
    description: 'University ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  universityId!: string

  @IsString()
  @ApiProperty({
    description: 'Name of the department that the major belongs to (Icelandic)',
    example: 'Verkfræði og náttúruvísindasvið',
  })
  departmentNameIs!: string

  @IsString()
  @ApiProperty({
    description: 'Name of the department that the major belongs to (English)',
    example: 'Engineering and Natural Sciences',
  })
  departmentNameEn!: string

  @IsNumber()
  @ApiProperty({
    description: 'Which year this major started on',
    example: 2023,
  })
  startingSemesterYear!: number

  @IsEnum(Season)
  @ApiProperty({
    description: 'Which season this major started on',
    example: Season.FALL,
    enum: Season,
  })
  startingSemesterSeason!: Season

  @IsDate()
  @ApiProperty({
    description: 'When registration for this major opens',
    example: new Date('2023-05-01'),
  })
  registrationStart!: Date

  @IsDate()
  @ApiProperty({
    description: 'When registration for this major closes',
    example: new Date('2023-08-01'),
  })
  registrationEnd!: Date

  @IsEnum(DegreeType)
  @ApiProperty({
    description: 'Degree type',
    example: DegreeType.UNDERGRADUATE,
    enum: DegreeType,
  })
  degreeType!: DegreeType

  @IsString()
  @ApiProperty({
    description: 'Degree abbreviation',
    example: 'BSc',
  })
  degreeAbbreviation!: string

  @IsNumber()
  @ApiProperty({
    description: 'Number of course credits (in ECTS)',
    example: '180',
  })
  credits!: number

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Major description (Icelandic)',
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  })
  @ApiPropertyOptional()
  descriptionIs?: string

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Major description (English)',
    example: 'Mauris a justo arcu. Orci varius natoque penatibus.',
  })
  @ApiPropertyOptional()
  descriptionEn?: string

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Total duration for this major (in years)',
    example: 3,
  })
  @ApiPropertyOptional()
  durationInYears?: number

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Cost for major (per year)',
    example: 75000,
  })
  @ApiPropertyOptional()
  costPerYear?: number

  @IsString()
  @ApiProperty({
    description: 'ISCED code for major',
    example: '481',
  })
  iscedCode!: string

  @IsString()
  @IsOptional()
  @ApiProperty({
    description:
      'External url  for the major from the university web page (Icelandic)',
    example: 'https://www.ru.is/grunnnam/tolvunarfraedi',
  })
  @ApiPropertyOptional()
  externalUrlIs?: string

  @IsString()
  @IsOptional()
  @ApiProperty({
    description:
      'External url  for the major from the university web page (English)',
    example: 'https://en.ru.is/st/dcs/undergraduate-study/bsc-computer-science',
  })
  @ApiPropertyOptional()
  externalUrlEn?: string

  @IsEnum(StudyType)
  @IsArray()
  @ApiProperty({
    description: 'Study types available for the major',
    example: [StudyType.ON_SITE],
    enum: StudyType,
    isArray: true,
  })
  studyTypes!: [StudyType]

  @IsEnum(InterestTag)
  @IsArray()
  @ApiProperty({
    description:
      'Interest tag for the major (to be able to categorize majors after interest)',
    example: [InterestTag.ENGINEER],
    enum: InterestTag,
    isArray: true,
  })
  interestTags?: [InterestTag]

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Admission requirements for major (Icelandic)',
    example: 'Nemandinn verður að hafa klárað stúdentspróf',
  })
  @ApiPropertyOptional()
  admissionRequirementsIs?: string

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Admission requirements for major (English)',
    example: 'The student needs to have finished the matriculation exam',
  })
  @ApiPropertyOptional()
  admissionRequirementsEn?: string

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Study requirements for major (Icelandic)',
    example: 'Nemandinn verður að vera með lágmarkseinkunn 6 í öllum áföngum',
  })
  @ApiPropertyOptional()
  studyRequirementsIs?: string

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Study requirements for major (English)',
    example: 'The student must have a minimum grade of 6 in all courses',
  })
  @ApiPropertyOptional()
  studyRequirementsEn?: string

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Cost information for major (Icelandic)',
    example: 'Það verður að borga 10.000 kr staðfestingargjald fyrir 1. ágúst',
  })
  @ApiPropertyOptional()
  costInformationIs?: string

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Cost information for major (English)',
    example: 'A confirmation fee of ISK 10.000 must be paid before August 1',
  })
  @ApiPropertyOptional()
  costInformationEn?: string

  @IsArray()
  @ApiProperty({
    description: 'Column description for data',
    type: [CreateCourseDto],
  })
  courses!: CreateCourseDto[]

  @IsArray()
  @ApiProperty({
    description:
      'Other fields that should be displayed in the application for the major',
    type: [MajorOtherFieldDto],
  })
  otherFields?: MajorOtherFieldDto[]
}
