import { Controller, Get, Param, Query } from '@nestjs/common'
import { CourseService } from './course.service'
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { Course } from './course.model'

@ApiTags('Courses')
@Controller()
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get('courses')
  @ApiQuery({
    name: 'majorId',
    required: false,
    description: 'Param description for majorId',
  })
  @ApiQuery({
    name: 'universityId',
    required: false,
    description: 'Param description for universityId',
  })
  @ApiOkResponse({
    type: [Course],
    description: 'Response description for 200',
  })
  @ApiOperation({
    summary: 'Endpoint description for get courses',
  })
  async getCourses(
    @Query('majorId') majorId: string,
    @Query('universityId') universityId: string,
  ): Promise<Course[]> {
    return this.courseService.getCourses(majorId, universityId)
  }

  @Get('courses/:id')
  @ApiParam({
    name: 'id',
    required: true,
    allowEmptyValue: false,
    description: 'Param description for id',
  })
  @ApiOkResponse({
    type: Course,
    description: 'Response description for 200',
  })
  @ApiOperation({
    summary: 'Endpoint description for get course',
  })
  async getMajor(@Param('id') id: string): Promise<Course> {
    return this.courseService.getCourse(id)
  }
}
