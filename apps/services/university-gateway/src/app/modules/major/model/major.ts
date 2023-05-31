import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, DataType, HasMany } from 'sequelize-typescript'
import { DegreeType, InterestTag, Season } from '../types'
import { StudyType } from '../../application/types'
import { PageInfo } from './pageInfo'

export class Major {
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
    description: 'Column description for university id',
    example: 'Example value for university id',
  })
  universityId!: string

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for department name is',
    example: 'Example value for department name is',
  })
  departmentNameIs!: string

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for department name en',
    example: 'Example value for department name en',
  })
  departmentNameEn!: string

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for starting semester year',
    example: 'Example value for starting semester year',
  })
  startingSemesterYear!: number

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(Season),
  })
  @ApiProperty({
    description: 'Column description for starting semester season',
    example: Season.FALL,
    enum: Season,
  })
  startingSemesterSeason!: Season

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for registration start',
    example: 'Example value for registrationStart',
  })
  registrationStart!: Date

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for registration end',
    example: 'Example value for registrationEnd',
  })
  registrationEnd!: Date

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(DegreeType),
  })
  @ApiProperty({
    description: 'Column description for degree type',
    example: DegreeType.UNDERGRADUATE,
    enum: DegreeType,
  })
  degreeType!: DegreeType

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for degree abbreviation',
    example: 'Example value for degree abbreviation',
  })
  degreeAbbreviation!: string

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
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty({
    description: 'Column description for description is',
    example: 'Example value for description is',
  })
  @ApiPropertyOptional()
  descriptionIs?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty({
    description: 'Column description for description en',
    example: 'Example value for description en',
  })
  @ApiPropertyOptional()
  descriptionEn?: string

  @Column({
    type: DataType.NUMBER,
    allowNull: true,
  })
  @ApiProperty({
    description: 'Column description for duration in years',
    example: 'Example value for duration in years',
  })
  @ApiPropertyOptional()
  durationInYears?: number

  @Column({
    type: DataType.NUMBER,
    allowNull: true,
  })
  @ApiProperty({
    description: 'Column description for price per year',
    example: 'Example value for price per year',
  })
  @ApiPropertyOptional()
  pricePerYear?: number

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for isced code',
    example: 'Example value for isced code',
  })
  iscedCode!: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty({
    description: 'Column description for external url is',
    example: 'Example value for external url is',
  })
  @ApiPropertyOptional()
  externalUrlIs?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty({
    description: 'Column description for external url en',
    example: 'Example value for external url en',
  })
  @ApiPropertyOptional()
  externalUrlEn?: string

  @ApiProperty({
    description: 'Column description for study type',
    example: [StudyType.ON_SITE],
    enum: StudyType,
    isArray: true,
  })
  studyTypes!: [StudyType]

  @ApiProperty({
    description: 'Column description for interest tag',
    example: [InterestTag.ENGINEER],
    enum: InterestTag,
    isArray: true,
  })
  interestTags?: [InterestTag]
}

export class MajorDetails extends Major {}

export class MajorResponse {
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for data',
    type: Major,
    isArray: true,
  })
  data!: Major[]

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
