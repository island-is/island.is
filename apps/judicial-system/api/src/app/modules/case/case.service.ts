import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { CreateCaseDto, UpdateCaseDto } from './dto'
import { Case } from './case.model'
import { Notification } from './case.types'

@Injectable()
export class CaseService {
  constructor(
    @InjectModel(Case)
    private caseModel: typeof Case,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  getAll(): Promise<Case[]> {
    this.logger.debug('Getting all cases')

    return this.caseModel.findAll({ order: [['modified', 'DESC']] })
  }

  findById(id: string): Promise<Case> {
    this.logger.debug(`Finding case with id "${id}"`)

    return this.caseModel.findOne({
      where: { id },
    })
  }

  create(caseToCreate: CreateCaseDto): Promise<Case> {
    this.logger.debug(`Creating case ${caseToCreate}`)

    return this.caseModel.create(caseToCreate)
  }

  async update(
    id: string,
    caseToUpdate: UpdateCaseDto,
  ): Promise<{ numberOfAffectedRows: number; updatedCase: Case }> {
    this.logger.debug(`Updating case whith id "${id}"`)

    const [numberOfAffectedRows, [updatedCase]] = await this.caseModel.update(
      caseToUpdate,
      {
        where: { id },
        returning: true,
      },
    )

    return { numberOfAffectedRows, updatedCase }
  }

  delete(id: string): Promise<number> {
    this.logger.debug(`Deleting case with id "${id}"`)

    return this.caseModel.destroy({ where: { id } })
  }

  async getAllNotificationsByCaseId(id: string): Promise<Notification[]> {
    this.logger.debug(`Getting all notifications for case with id "${id}"`)

    return []
  }

  async sendNotificationByCaseId(id: string): Promise<Notification> {
    return new Notification()
  }
}
