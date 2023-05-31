import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { CourseService } from './course.service'
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { CourseDetails, CourseDetailsResponse, CourseResponse } from './model'
import { CreateCourseDto, UpdateCourseDto } from './dto'

@ApiTags('Course')
@Controller()
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get('courses')
  @ApiQuery({
    name: 'limit',
    required: false,
    description:
      'Limits the number of results in a request. The server should have a default value for this field.',
  })
  @ApiQuery({
    name: 'before',
    required: false,
    description:
      'The client provides the value of startCursor from the previous response pageInfo to query the previous page of limit number of data items.',
  })
  @ApiQuery({
    name: 'after',
    required: false,
    description:
      'The client provides the value of endCursor from the previous response to query the next page of limit number of data items.',
  })
  @ApiQuery({
    name: 'majorId',
    required: false,
    description: 'Major ID',
  })
  @ApiQuery({
    name: 'universityId',
    required: false,
    description: 'University ID',
  })
  @ApiOkResponse({
    type: CourseResponse,
    description: 'Returns all courses for the selected filtering',
  })
  @ApiOperation({
    summary: 'Get all courses',
  })
  async getCourses(
    @Query('limit') limit: number,
    @Query('before') before: string,
    @Query('after') after: string,
    @Query('majorId') majorId: string,
    @Query('universityId') universityId: string,
  ): Promise<CourseResponse> {
    return this.courseService.getCourses(
      { after, before, limit },
      majorId,
      universityId,
    )
  }

  @Get('courses/:id')
  @ApiParam({
    name: 'id',
    required: true,
    allowEmptyValue: false,
    description: 'Course ID',
  })
  @ApiOkResponse({
    type: CourseDetailsResponse,
    description: 'Returns the course by ID',
  })
  @ApiOperation({
    summary: 'Get course by ID',
  })
  async getCourseDetails(
    @Param('id') id: string,
  ): Promise<CourseDetailsResponse> {
    return this.courseService.getCourseDetails(id)
  }

  @Post('courses')
  @ApiBody({
    type: CreateCourseDto,
  })
  @ApiCreatedResponse({
    type: CourseDetails,
    description: 'Returns the course that was created',
  })
  @ApiOperation({
    summary: 'Create course',
  })
  async createCourse(
    @Body() courseDto: CreateCourseDto,
  ): Promise<CourseDetails> {
    return this.courseService.createCourse(courseDto)
  }

  @Put('courses/:id')
  @ApiParam({
    name: 'id',
    required: true,
    allowEmptyValue: false,
    description: 'Course ID',
  })
  @ApiBody({
    type: UpdateCourseDto,
  })
  @ApiOkResponse({
    type: CourseDetails,
    description: 'Returns the updated course',
  })
  @ApiOperation({
    summary: 'Update course',
  })
  async updateCourse(
    @Param('id') id: string,
    @Body() courseDto: UpdateCourseDto,
  ): Promise<CourseDetails> {
    return this.courseService.updateCourse(id, courseDto)
  }

  @Delete('courses/:id')
  @ApiParam({
    name: 'id',
    required: true,
    allowEmptyValue: false,
    description: 'Course ID',
  })
  @ApiOkResponse({
    type: Number,
    description: 'Returns the number of courses that was deleted',
  })
  @ApiOperation({
    summary: 'Delete course',
  })
  async deleteCourse(@Param('id') id: string): Promise<number> {
    return this.courseService.deleteCourse(id)
  }
}
