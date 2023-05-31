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
    description: 'Param description for majorId',
  })
  @ApiQuery({
    name: 'universityId',
    required: false,
    description: 'Param description for universityId',
  })
  @ApiOkResponse({
    type: CourseResponse,
    description: 'Response description for 200',
  })
  @ApiOperation({
    summary: 'Endpoint description for get courses',
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
    description: 'Param description for id',
  })
  @ApiOkResponse({
    type: CourseDetailsResponse,
    description: 'Response description for 200',
  })
  @ApiOperation({
    summary: 'Endpoint description for get course by id',
  })
  async getCourse(@Param('id') id: string): Promise<CourseDetailsResponse> {
    return this.courseService.getCourse(id)
  }

  @Post('courses')
  @ApiBody({
    type: CreateCourseDto,
  })
  @ApiOkResponse({
    type: CourseDetails,
    description: 'Response description for 200',
  })
  @ApiOperation({
    summary: 'Endpoint description for post course',
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
    description: 'Param description for id',
  })
  @ApiBody({
    type: UpdateCourseDto,
  })
  @ApiOkResponse({
    type: CourseDetails,
    description: 'Response description for 200',
  })
  @ApiOperation({
    summary: 'Endpoint description for put course',
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
    description: 'Param description for id',
  })
  @ApiOkResponse({
    type: Number,
    description: 'Response description for 200',
  })
  @ApiOperation({
    summary: 'Endpoint description for delete course',
  })
  async deleteCourse(@Param('id') id: string): Promise<number> {
    return this.courseService.deleteCourse(id)
  }
}
