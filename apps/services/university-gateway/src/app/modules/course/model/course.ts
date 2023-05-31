import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, DataType } from 'sequelize-typescript'
import { Season } from '../../major/types'
import { PageInfo } from '../../major/model/pageInfo'

export class Course {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for id',
    example: 'Example value for id',
  })
  id!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for external id',
    example: 'Example value for external id',
  })
  externalId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for name is',
    example: 'Example value for name is',
  })
  nameIs!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for name en',
    example: 'Example value for name en',
  })
  nameEn!: string

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for universityId',
    example: 'Example value for universityId',
  })
  universityId!: string

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for majorId',
    example: 'Example value for majorId',
  })
  majorId!: string

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for credits',
    example: 'Example value for credits',
  })
  credits!: number

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for semester year',
    example: 'Example value for semester year',
  })
  semesterYear!: number

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(Season),
  })
  @ApiProperty({
    description: 'Column description for semester season',
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
    description: 'Column description for data',
    type: Course,
    isArray: true,
  })
  data!: Course[]

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for page info',
    type: PageInfo,
  })
  pageInfo!: PageInfo

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for total count',
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
    description: 'Column description for data',
    type: CourseDetails,
  })
  data!: CourseDetails
}
