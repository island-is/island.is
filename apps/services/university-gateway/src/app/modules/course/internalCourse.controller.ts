import { HttpStatus } from '@nestjs/common'
import { Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Documentation } from '@island.is/nest/swagger'
import { InternalCourseService } from './internalCourse.service'

//TODOx remove as controller?
@ApiTags('Internal course')
@Controller({
  path: 'internal/courses',
  version: ['1'],
})
export class InternalCourseController {
  constructor(private readonly internalCourseService: InternalCourseService) {}

  @Post('update')
  @Documentation({
    description:
      'Updates courses (in program) in our DB by fetching data from the university APIs',
  })
  updateCourses() {
    this.internalCourseService.updateCourses()
    return HttpStatus.ACCEPTED
  }
}
