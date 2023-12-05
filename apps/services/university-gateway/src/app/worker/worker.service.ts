import { Injectable } from '@nestjs/common'
import { InternalProgramService } from '../modules/program/internalProgram.service'
import { InternalCourseService } from '../modules/course/internalCourse.service'
import { logger } from '@island.is/logging'

@Injectable()
export class UniversityGatewayWorkerService {
  constructor(
    private readonly internalProgramService: InternalProgramService,
    private readonly internalCourseService: InternalCourseService,
  ) {}

  public async run() {
    logger.info(`Starting university gateway worker...`)
    await this.internalProgramService.updatePrograms()
    await this.internalCourseService.updateCourses()
    logger.info(`University gateway worker done.`)
  }
}
