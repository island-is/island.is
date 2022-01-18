import { Transaction } from 'sequelize/types'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

import { CreateDefendantDto } from './dto/createDefendant.dto'
import { UpdateDefendantDto } from './dto/updateDefendant.dto'
import { Defendant } from './models/defendant.model'

@Injectable()
export class DefendantService {
  constructor(
    @InjectModel(Defendant) private readonly defendantModel: typeof Defendant,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async findById(defendantId: string, caseId: string): Promise<Defendant> {
    const defendant = await this.defendantModel.findOne({
      where: { id: defendantId, caseId },
    })

    if (!defendant) {
      throw new NotFoundException(
        `Defendant ${defendantId} of case ${caseId} does not exist`,
      )
    }

    return defendant
  }

  async create(
    caseId: string,
    defendantToCreate: CreateDefendantDto,
    transaction?: Transaction,
  ): Promise<Defendant> {
    this.logger.debug('!!!!', { defendantToCreate })
    return this.defendantModel.create(
      { ...defendantToCreate, caseId },
      { transaction },
    )
  }

  async update(
    caseId: string,
    defendantId: string,
    update: UpdateDefendantDto,
  ): Promise<Defendant> {
    const [numberOfAffectedRows, defendants] = await this.defendantModel.update(
      update,
      {
        where: { id: defendantId, caseId },
        returning: true,
      },
    )

    if (numberOfAffectedRows > 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when updating defendant ${defendantId} of case ${caseId}`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(
        `Could not update defendant ${defendantId} of case ${caseId}`,
      )
    }

    return defendants[0]
  }

  async delete(caseId: string, defendantId: string): Promise<boolean> {
    const numberOfAffectedRows = await this.defendantModel.destroy({
      where: { id: defendantId, caseId },
    })

    if (numberOfAffectedRows > 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when deleting defendant ${defendantId} of case ${caseId}`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(
        `Could not delete defendant ${defendantId} of case ${caseId}`,
      )
    }

    return true
  }
}
