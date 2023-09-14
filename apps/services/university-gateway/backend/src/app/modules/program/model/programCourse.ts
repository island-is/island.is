import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
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
import { Course } from '../../course/model'
import { ProgramTable } from './program'
import { Requirement } from '@island.is/university-gateway-lib'

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

  @ApiHideProperty()
  @CreatedAt
  readonly created!: Date

  @ApiHideProperty()
  @UpdatedAt
  readonly modified!: Date
}
