import { UseGuards } from '@nestjs/common'
import {
  BypassAuth,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Controller, Get, Param, Query } from '@nestjs/common'
import { CourseService } from './course.service'
import { ApiTags } from '@nestjs/swagger'
import { Documentation } from '@island.is/nest/swagger'
import { CoursesResponse } from './dto/coursesResponse'
import { Course } from './model/course'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('Course')
@Controller({
  path: 'courses',
  version: ['1'],
})
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @BypassAuth()
  @Get()
  @Documentation({
    description: 'Get all courses',
    response: {
      status: 200,
      type: CoursesResponse,
    },
    request: {
      query: {
        limit: {
          type: 'number',
          description:
            'Limits the number of results in a request. The server should have a default value for this field.',
          required: false,
        },
        before: {
          type: 'string',
          description:
            'The client provides the value of startCursor from the previous response pageInfo to query the previous page of limit number of data items.',
          required: false,
        },
        after: {
          type: 'string',
          description:
            'The client provides the value of endCursor from the previous response to query the next page of limit number of data items.',
          required: false,
        },
        programId: {
          type: 'string',
          description: 'Program ID',
          required: false,
        },
        universityId: {
          type: 'string',
          description: 'University ID',
          required: false,
        },
      },
    },
  })
  getCourses(
    @Query('limit') limit: number,
    @Query('before') before: string,
    @Query('after') after: string,
    @Query('programId') programId: string,
    @Query('universityId') universityId: string,
  ): Promise<CoursesResponse> {
    return this.courseService.getCourses(
      limit,
      after,
      before,
      programId,
      universityId,
    )
  }

  @BypassAuth()
  @Get(':id')
  @Documentation({
    description: 'Get course by ID',
    response: {
      status: 200,
      type: Course,
    },
    request: {
      params: {
        id: {
          type: 'string',
          description: 'Course ID',
          required: true,
        },
      },
    },
  })
  getCourseById(@Param('id') id: string): Promise<Course> {
    return this.courseService.getCourseById(id)
  }
}
