import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { DegreeType, Season } from '../../program/types'
import { ExampleCourse } from './exampleCourse'
import { ExampleProgramExtraApplicationField } from './exampleProgramExtraApplicationField'
import { ExampleProgramModeOfDelivery } from './exampleProgramModeOfDelivery'
import { ExampleProgramTag } from './exampleProgramTag'

export class ExampleProgram {
  // @ApiProperty({
  //   description: 'Program ID',
  //   example: '00000000-0000-0000-0000-000000000000',
  // })
  // id!: string

  @ApiProperty({
    description: 'External ID for the program (from University)',
    example: 'ABC12345',
  })
  externalId!: string

  // @ApiProperty({
  //   description:
  //     'Whether the program is active and should be displayed on the external web',
  //   example: true,
  // })
  // active!: boolean

  @ApiProperty({
    description: 'Program name (Icelandic)',
    example: 'Tölvunarfræði',
  })
  nameIs!: string

  @ApiProperty({
    description: 'Program name (English)',
    example: 'Computer science',
  })
  nameEn!: string

  // @ApiProperty({
  //   description: 'University ID',
  //   example: '00000000-0000-0000-0000-000000000000',
  // })
  // universityId!: string

  @ApiProperty({
    description:
      'Name of the department that the program belongs to (Icelandic)',
    example: 'Verkfræði og náttúruvísindasvið',
  })
  departmentNameIs!: string

  @ApiProperty({
    description: 'Name of the department that the program belongs to (English)',
    example: 'Engineering and Natural Sciences',
  })
  departmentNameEn!: string

  @ApiProperty({
    description: 'Which year this program started on',
    example: 2023,
  })
  startingSemesterYear!: number

  @ApiProperty({
    description: 'Which season this program started on',
    example: Season.FALL,
    enum: Season,
  })
  startingSemesterSeason!: Season

  @ApiProperty({
    description: 'When the application period for this program starts',
    example: new Date('2023-05-01'),
  })
  applicationStartDate!: Date

  @ApiProperty({
    description: 'When the application period for this program ends',
    example: new Date('2023-08-01'),
  })
  applicationEndDate!: Date

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
    description: 'Program description (Icelandic)',
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  })
  descriptionIs!: string

  @ApiProperty({
    description: 'Program description (English)',
    example: 'Mauris a justo arcu. Orci varius natoque penatibus.',
  })
  descriptionEn!: string

  @ApiProperty({
    description: 'Total duration for this program (in years)',
    example: 3,
  })
  durationInYears!: number

  @ApiProperty({
    description: 'Cost for program (per year)',
    example: 75000,
  })
  @ApiPropertyOptional()
  costPerYear?: number

  @ApiProperty({
    description: 'ISCED code for program',
    example: '481',
  })
  iscedCode!: string

  @ApiProperty({
    description:
      'External url  for the program from the university web page (Icelandic)',
    example: 'https://www.ru.is/grunnnam/tolvunarfraedi',
  })
  @ApiPropertyOptional()
  externalUrlIs?: string

  @ApiProperty({
    description:
      'External url  for the program from the university web page (English)',
    example: 'https://en.ru.is/st/dcs/undergraduate-study/bsc-computer-science',
  })
  @ApiPropertyOptional()
  externalUrlEn?: string

  @ApiProperty({
    description: 'Search keywords for the program',
    example: ['stærðfræði'],
  })
  searchKeywords!: string[]

  @ApiProperty({
    description: 'Admission requirements for program (Icelandic)',
    example: 'Nemandinn verður að hafa klárað stúdentspróf',
  })
  @ApiPropertyOptional()
  admissionRequirementsIs?: string

  @ApiProperty({
    description: 'Admission requirements for program (English)',
    example: 'The student needs to have finished the matriculation exam',
  })
  @ApiPropertyOptional()
  admissionRequirementsEn?: string

  @ApiProperty({
    description: 'Study requirements for program (Icelandic)',
    example: 'Nemandinn verður að vera með lágmarkseinkunn 6 í öllum áföngum',
  })
  @ApiPropertyOptional()
  studyRequirementsIs?: string

  @ApiProperty({
    description: 'Study requirements for program (English)',
    example: 'The student must have a minimum grade of 6 in all courses',
  })
  @ApiPropertyOptional()
  studyRequirementsEn?: string

  @ApiProperty({
    description: 'Cost information for program (Icelandic)',
    example: 'Það verður að borga 10.000 kr staðfestingargjald fyrir 1. ágúst',
  })
  @ApiPropertyOptional()
  costInformationIs?: string

  @ApiProperty({
    description: 'Cost information for program (English)',
    example: 'A confirmation fee of ISK 10.000 must be paid before August 1',
  })
  @ApiPropertyOptional()
  costInformationEn?: string

  @ApiProperty({
    description: 'List of courses that belong to this program',
    type: [ExampleCourse],
  })
  courses!: ExampleCourse[]

  @ApiProperty({
    description: 'Modes of deliveries available for the program',
    type: [ExampleProgramModeOfDelivery],
  })
  modeOfDelivery!: [ExampleProgramModeOfDelivery]

  @ApiProperty({
    description:
      'List of (interest) tags connected to this program (to be able to categorize programs after interest)',
    type: [ExampleProgramTag],
  })
  tag?: [ExampleProgramTag]

  @ApiProperty({
    description:
      'Extra application fields that should be displayed in the application for the program',
    type: [ExampleProgramExtraApplicationField],
  })
  extraApplicationFields?: [ExampleProgramExtraApplicationField]
}

export class ExampleProgramResponse {
  @ApiProperty({
    description: 'Program data',
    type: [ExampleProgram],
  })
  data!: ExampleProgram[]
}
