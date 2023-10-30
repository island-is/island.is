import { HttpStatus, UseGuards } from '@nestjs/common'
import { TokenGuard } from '@island.is/judicial-system/auth'
import { Controller, Post } from '@nestjs/common'
import {
  ApiAcceptedResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { InternalCourseService } from './internalCourse.service'

@UseGuards(TokenGuard)
@ApiTags('Internal course')
@Controller({
  path: 'internal/courses',
  version: ['1'],
})
export class InternalCourseController {
  constructor(private readonly internalCourseService: InternalCourseService) {}

  @Post('update')
  @ApiNoContentResponse()
  @ApiAcceptedResponse()
  @ApiOperation({
    summary:
      'Updates courses (in program) in our DB by fetching data from the university APIs',
  })
  updateCourses(): HttpStatus {
    this.internalCourseService.updateCourses()
    return HttpStatus.ACCEPTED
  }
}
