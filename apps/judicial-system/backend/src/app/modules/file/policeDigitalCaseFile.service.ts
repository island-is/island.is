import { Transaction } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  PoliceDigitalCaseFile,
  PoliceDigitalCaseFileRepositoryService,
} from '../repository'
import { CreatePoliceDigitalCaseFileDto } from './dto/createPoliceDigitalCaseFile.dto'

@Injectable()
export class PoliceDigitalCaseFileService {
  constructor(
    private readonly policeDigitalCaseFileRepositoryService: PoliceDigitalCaseFileRepositoryService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async createPoliceDigitalCaseFile(
    caseId: string,
    dto: CreatePoliceDigitalCaseFileDto,
    transaction: Transaction,
  ): Promise<PoliceDigitalCaseFile> {
    this.logger.debug(
      `Creating police digital case file for case ${caseId}`,
    )

    return this.policeDigitalCaseFileRepositoryService.create(
      { caseId, ...dto },
      { transaction },
    )
  }

  async getPoliceDigitalCaseFiles(
    caseId: string,
    policeCaseNumber?: string,
  ): Promise<PoliceDigitalCaseFile[]> {
    this.logger.debug(
      `Getting police digital case files for case ${caseId}`,
    )

    const where: Record<string, string> = { caseId }

    if (policeCaseNumber) {
      where['policeCaseNumber'] = policeCaseNumber
    }

    return this.policeDigitalCaseFileRepositoryService.findAll({ where })
  }
}
