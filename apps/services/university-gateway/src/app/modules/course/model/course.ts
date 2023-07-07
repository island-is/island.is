import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Season } from '../../program/types'
import { University } from '../../university/model'
import { PageInfo } from '@island.is/nest/pagination'

@Table({
  tableName: 'course',
})
export class Course extends Model {
  @ApiProperty({
    description: 'Course ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string

  @ApiProperty({
    description: 'External ID for the course (from University)',
    example: 'ABC12345',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  externalId!: string

  @ApiProperty({
    description: 'Course name (Icelandic)',
    example: 'Tölvunarfræði I',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nameIs!: string

  @ApiProperty({
    description: 'Course name (English)',
    example: 'Computer science I',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nameEn!: string

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
    description: 'Number of course credits (in ECTS)',
    example: 8,
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  credits!: number

  @ApiProperty({
    description: 'Which year this course is taught on',
    example: 2023,
  })
  @ApiPropertyOptional()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  semesterYear?: number

  @ApiProperty({
    description: 'Which season this course is taught on',
    example: Season.FALL,
    enum: Season,
  })
  @Column({
    type: DataType.ENUM,
    values: Object.values(Season),
    allowNull: false,
  })
  semesterSeason!: Season

  @ApiProperty({
    description: 'Course description (Icelandic)',
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  })
  @ApiPropertyOptional()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  descriptionIs?: string

  @ApiProperty({
    description: 'Course description (English)',
    example: 'Mauris a justo arcu. Orci varius natoque penatibus.',
  })
  @ApiPropertyOptional()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  descriptionEn?: string

  @ApiProperty({
    description:
      'External url  for the course from the university web page (Icelandic)',
    example: 'https://www.hi.is/grunnnam/tolvunarfraedi/staerdfraedigreining-i',
  })
  @ApiPropertyOptional()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  externalUrlIs?: string

  @ApiProperty({
    description:
      'External url  for the course from the university web page (English)',
    example:
      'https://www.en.hi.is/undergraduate-study/computer-science/mathematical-analysis-i',
  })
  @ApiPropertyOptional()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  externalUrlEn?: string

  @ApiProperty({
    type: String,
  })
  @CreatedAt
  readonly created!: Date

  @ApiProperty({
    type: String,
  })
  @UpdatedAt
  readonly modified!: Date
}

export class CourseResponse {
  @ApiProperty({
    description: 'Course data',
    type: [Course],
  })
  data!: Course[]

  @ApiProperty({
    description: 'Page information (for pagination)',
  })
  pageInfo!: PageInfo

  @ApiProperty({
    description: 'Total number of items in result (for pagination)',
  })
  totalCount!: number
}

export class CourseDetailsResponse {
  @ApiProperty({
    description: 'Course data',
    type: Course,
  })
  data!: Course
}
