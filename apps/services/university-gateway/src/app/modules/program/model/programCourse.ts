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
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Course } from '../../course/model/course'
import { Program } from './program'
import { Requirement, Season } from '@island.is/university-gateway'
import { CreationOptional } from 'sequelize'

@Table({
  tableName: 'program_course',
})
export class ProgramCourse extends Model {
  @ApiHideProperty()
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: CreationOptional<string>

  @ApiHideProperty()
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ForeignKey(() => Program)
  programId!: string

  @ApiHideProperty()
  @BelongsTo(() => Program, 'programId')
  program?: Program

  @ApiHideProperty()
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ForeignKey(() => Course)
  courseId!: string

  @ApiProperty({
    description: 'Course details',
    type: Course,
  })
  @BelongsTo(() => Course, 'courseId')
  details?: Course

  @ApiProperty({
    description: 'Whether the course is required or not',
    example: Requirement.MANDATORY,
    enum: Requirement,
  })
  @Column({
    type: DataType.ENUM,
    values: Object.values(Requirement),
    allowNull: false,
  })
  requirement!: Requirement

  @ApiPropertyOptional({
    description: 'Which year this course is taught on',
    example: 2023,
  })
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

  @ApiHideProperty()
  @CreatedAt
  readonly created!: CreationOptional<Date>

  @ApiHideProperty()
  @UpdatedAt
  readonly modified!: CreationOptional<Date>
}
