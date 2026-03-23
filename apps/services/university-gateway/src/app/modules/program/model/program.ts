import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger'
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { ProgramExtraApplicationField } from './programExtraApplicationField'
import { ProgramModeOfDelivery } from './programModeOfDelivery'
import { University } from '../../university/model/university'
import { DegreeType, Season } from '@island.is/university-gateway'
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'

export class ProgramBase extends Model<
  InferAttributes<Program>,
  InferCreationAttributes<Program>
> {
  @ApiProperty({
    description: 'Program ID',
    example: '00000000-0000-0000-0000-000000000000',
    type: String,
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: CreationOptional<string>

  @ApiProperty({
    description: 'External ID for the program (from University)',
    example: 'ABC12345',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  externalId!: string

  @ApiProperty({
    description: 'Program name (Icelandic)',
    example: 'Tölvunarfræði',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nameIs!: string

  @ApiProperty({
    description: 'Program name (English)',
    example: 'Computer science',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nameEn!: string

  @ApiPropertyOptional({
    description: 'External ID for the specialization(from University)',
    example: 'ABC12345',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  specializationExternalId?: string

  @ApiPropertyOptional({
    description: 'Specialization name (Icelandic)',
    example: 'Tölvunarfræði',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  specializationNameIs?: string

  @ApiPropertyOptional({
    description: 'Specialization name (English)',
    example: 'Computer science',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  specializationNameEn?: string

  @ApiProperty({
    description: 'University ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ForeignKey(() => University)
  universityId!: string

  @ApiProperty({
    description: 'University details',
    type: University,
  })
  @BelongsTo(() => University, 'universityId')
  universityDetails?: University

  @ApiProperty({
    description:
      'Name of the department that the program belongs to (Icelandic)',
    example: 'Verkfræði og náttúruvísindasvið',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  departmentNameIs!: string

  @ApiProperty({
    description: 'Name of the department that the program belongs to (English)',
    example: 'Engineering and Natural Sciences',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  departmentNameEn!: string

  @ApiProperty({
    description: 'Which year this program started on',
    example: 2023,
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  startingSemesterYear!: number

  @ApiProperty({
    description: 'Which season this program started on',
    example: Season.FALL,
    enum: Season,
  })
  @Column({
    type: DataType.ENUM,
    values: Object.values(Season),
    allowNull: false,
  })
  startingSemesterSeason!: Season

  @ApiProperty({
    description: 'When the application period for this program starts',
    example: new Date('2023-05-01'),
    type: String,
    format: 'date-time',
    nullable: true,
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare applicationStartDate: Date | null

  @ApiProperty({
    description: 'When the application period for this program ends',
    example: new Date('2023-08-01'),
    type: String,
    format: 'date-time',
    nullable: true,
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare applicationEndDate: Date | null

  @ApiPropertyOptional({
    description: 'Last date for school to accept/decline student into program',
    example: new Date('2023-08-15'),
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  schoolAnswerDate?: Date

  @ApiPropertyOptional({
    description:
      'Last date for student to accept enrollment in school (after school accepts student)',
    example: new Date('2023-09-01'),
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  studentAnswerDate?: Date

  @ApiProperty({
    description: 'Degree type',
    example: DegreeType.UNDERGRADUATE,
    enum: DegreeType,
  })
  @Column({
    type: DataType.ENUM,
    values: Object.values(DegreeType),
    allowNull: false,
  })
  degreeType!: DegreeType

  @ApiProperty({
    description: 'Degree abbreviation',
    example: 'BSc',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  degreeAbbreviation!: string

  @ApiProperty({
    description: 'Number of course credits (in ECTS)',
    example: 180,
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  credits!: number

  @ApiProperty({
    description: 'Program description (Icelandic)',
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  descriptionIs!: string

  @ApiProperty({
    description: 'Program description (English)',
    example: 'Mauris a justo arcu. Orci varius natoque penatibus.',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  descriptionEn!: string

  @ApiProperty({
    description: 'Total duration for this program (in years)',
    example: 3,
  })
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  durationInYears!: number

  @ApiPropertyOptional({
    description: 'Cost for program (per year)',
    example: 75000,
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  costPerYear?: number

  @ApiProperty({
    description: 'ISCED code for program',
    example: '481',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  iscedCode!: string

  @ApiProperty({
    description: 'Modes of deliveries available for the program',
    type: [ProgramModeOfDelivery],
  })
  @HasMany(() => ProgramModeOfDelivery)
  modeOfDelivery!: ProgramModeOfDelivery[]

  @ApiProperty({
    description:
      'Whether the program is active and should be displayed on the external web',
    example: true,
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  active!: boolean

  @ApiHideProperty()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  tmpActive!: boolean

  @ApiHideProperty()
  @CreatedAt
  readonly created!: CreationOptional<Date>

  @ApiHideProperty()
  @UpdatedAt
  readonly modified!: CreationOptional<Date>

  @ApiProperty({
    description:
      'Whether the application period for the program is open and applications can be submitted',
    example: true,
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  applicationPeriodOpen!: boolean

  @ApiProperty({
    description:
      'Whether applications for the program should be submitted via University Gateway or the application portals of each university',
    example: true,
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  applicationInUniversityGateway!: boolean
}
/*
  This Model is for program information that are passed into the application, it doesn't need all the values passed to the Program model or ProgramBase so a new model was created with the necessary information
*/

@Table({
  tableName: 'program',
})
export class Program extends ProgramBase {
  @ApiPropertyOptional({
    description:
      'External url  for the program from the university web page (Icelandic)',
    example: 'https://www.ru.is/grunnnam/tolvunarfraedi',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  externalUrlIs?: string

  @ApiPropertyOptional({
    description:
      'External url  for the program from the university web page (English)',
    example: 'https://en.ru.is/st/dcs/undergraduate-study/bsc-computer-science',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  externalUrlEn?: string

  @ApiPropertyOptional({
    description: 'Admission requirements for program (Icelandic)',
    example: 'Nemandinn verður að hafa klárað stúdentspróf',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  admissionRequirementsIs?: string

  @ApiPropertyOptional({
    description: 'Admission requirements for program (English)',
    example: 'The student needs to have finished the matriculation exam',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  admissionRequirementsEn?: string

  @ApiPropertyOptional({
    description: 'Study requirements for program (Icelandic)',
    example: 'Nemandinn verður að vera með lágmarkseinkunn 6 í öllum áföngum',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  studyRequirementsIs?: string

  @ApiPropertyOptional({
    description: 'Study requirements for program (English)',
    example: 'The student must have a minimum grade of 6 in all courses',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  studyRequirementsEn?: string

  @ApiPropertyOptional({
    description: 'Cost information for program (Icelandic)',
    example: 'Það verður að borga 10.000 kr staðfestingargjald fyrir 1. ágúst',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  costInformationIs?: string

  @ApiPropertyOptional({
    description: 'Cost information for program (English)',
    example: 'A confirmation fee of ISK 10.000 must be paid before August 1',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  costInformationEn?: string

  @ApiPropertyOptional({
    description: 'Arrangement for program (skipulag náms) (Icelandic)',
    example:
      'Á fyrsta ári er 60 einingar, á öðru 60 einingar og á þriðja 60 einingar',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  arrangementIs?: string

  @ApiPropertyOptional({
    description: 'Arrangement for program (English)',
    example:
      'The first year is 60 credits, the second 60 credits and the third 60 credits',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  arrangementEn?: string

  @ApiProperty({
    description:
      'Whether the program allows applicants to apply using exception',
    example: true,
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  allowException!: boolean

  @ApiProperty({
    description:
      'Whether the program allows applicants to apply using third level qualification',
    example: true,
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  allowThirdLevelQualification!: boolean

  @ApiProperty({
    description:
      'Extra application fields that should be displayed in the application for the program',
    type: [ProgramExtraApplicationField],
  })
  @HasMany(() => ProgramExtraApplicationField)
  extraApplicationFields?: ProgramExtraApplicationField[]
}
