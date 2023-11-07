import { ApiProperty } from '@nestjs/swagger'
import { Course } from '../model/course'

export class CourseDetailsResponse {
  @ApiProperty({
    description: 'Course data',
    type: Course,
  })
  data!: Course
}
