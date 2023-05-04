import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, DataType } from 'sequelize-typescript'

export enum SeasonEnum {
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  FALL = 'FALL',
}

export enum DegreeTypeEnum {
  UNDERGRADUATE = 'UNDERGRADUATE',
  POSTGRADUATE = 'POSTGRADUATE',
  DOCTORAL = 'DOCTORAL',
}

export class University {
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
    description: 'Column description for name',
    example: 'Example value for name',
  })
  name!: string
}

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
    description: 'Column description for name',
    example: 'Example value for name',
  })
  name!: string

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
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for universityName',
    example: 'Example value for universityName',
  })
  universityName!: string

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(DegreeTypeEnum),
  })
  @ApiProperty({
    description: 'Column description for degreeType',
    example: DegreeTypeEnum.UNDERGRADUATE,
    enum: DegreeTypeEnum,
  })
  degreeType!: DegreeTypeEnum

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for degreeAbbreviation',
    example: 'Example value for degreeAbbreviation',
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
    type: DataType.DATE,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for registrationStart',
    example: 'Example value for registrationStart',
  })
  registrationStart!: Date

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for registrationEnd',
    example: 'Example value for registrationEnd',
  })
  registrationEnd!: Date

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for year',
    example: 'Example value for year',
  })
  year!: number

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(SeasonEnum),
  })
  @ApiProperty({
    description: 'Column description for season',
    example: SeasonEnum.FALL,
    enum: SeasonEnum,
  })
  season!: SeasonEnum

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for requireCourseSelection',
    example: false,
  })
  requireCourseSelection!: boolean
}

export class MajorDetails {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty({
    description: 'Column description for description',
    example: 'Example value for description',
  })
  @ApiPropertyOptional()
  description?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty({
    description: 'TBD',
    example: 'TBD',
  })
  @ApiPropertyOptional()
  tbd?: string
}
