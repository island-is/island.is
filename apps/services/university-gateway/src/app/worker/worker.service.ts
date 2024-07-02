import { Injectable } from '@nestjs/common'
import { InternalProgramService } from '../modules/program/internalProgram.service'
import { InternalApplicationService } from '../modules/application/internalApplication.service'
import { logger } from '@island.is/logging'

@Injectable()
export class UniversityGatewayWorkerService {
  constructor(
    private readonly internalProgramService: InternalProgramService,
    private readonly internalApplicationService: InternalApplicationService,
  ) {}

  public async run() {
    logger.info(`Starting university gateway worker...`)
    await this.internalProgramService.updatePrograms()
    logger.info(`University gateway worker done.`)
  }
}
