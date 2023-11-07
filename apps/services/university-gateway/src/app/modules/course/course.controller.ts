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
import { CourseResponse } from './dto/courseResponse'
import { CourseDetailsResponse } from './dto/courseDetailsResponse'

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
      type: CourseResponse,
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
    @Query('programMinorId') programMinorId: string,
    @Query('universityId') universityId: string,
  ): Promise<CourseResponse> {
    return this.courseService.getCourses(
      limit,
      after,
      before,
      programId,
      programMinorId,
      universityId,
    )
  }

  @BypassAuth()
  @Get(':id')
  @Documentation({
    description: 'Get course by ID',
    response: {
      status: 200,
      type: CourseDetailsResponse,
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
  getCourseDetails(@Param('id') id: string): Promise<CourseDetailsResponse> {
    return this.courseService.getCourseDetails(id)
  }
}
