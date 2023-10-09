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
import { ProgramTable } from './program'
import { ProgramMinor } from './programMinor'
import { Course } from '../../course/model'
import { Requirement, Season } from '@island.is/university-gateway-lib'

export
@Table({
  tableName: 'program_course',
})
class ProgramCourse extends Model {
  @ApiHideProperty()
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string

  @ApiHideProperty()
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ForeignKey(() => ProgramTable)
  programId!: string

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ForeignKey(() => ProgramMinor)
  programMinorId?: string

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

  @ApiHideProperty()
  @CreatedAt
  readonly created!: Date

  @ApiHideProperty()
  @UpdatedAt
  readonly modified!: Date
}
