import { Sequelize, Transaction } from 'sequelize'

import {
  BadRequestException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { ServiceRequirement } from '@island.is/judicial-system/types'

import { InternalUpdateVerdictDto } from './dto/internalUpdateVerdict.dto'
import { UpdateVerdictDto } from './dto/updateVerdict.dto'
import { Verdict } from './models/verdict.model'

export class VerdictService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(Verdict) private readonly verdictModel: typeof Verdict,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async findById(
    verdictId: string,
    transaction?: Transaction,
  ): Promise<Verdict> {
    const verdict = await this.verdictModel.findOne({
      where: { id: verdictId },
      transaction,
    })

    if (!verdict) {
      throw new NotFoundException(`Verdict ${verdictId} does not exist`)
    }

    return verdict
  }

  async createVerdict(
    defendantId: string,
    caseId: string,
    transaction: Transaction,
  ): Promise<Verdict> {
    return this.verdictModel.create({ defendantId, caseId }, { transaction })
  }

  private async handleServiceRequirementUpdate(
    verdictId: string,
    update: UpdateVerdictDto,
    transaction: Transaction,
    rulingDate?: Date,
  ): Promise<UpdateVerdictDto> {
    // rulingDate should be set, but the case completed guard can not guarantee its presence
    // ensure that ruling date is present to prevent side effects in handle service requirement update
    if (!rulingDate) {
      throw new BadRequestException(
        'Missing rulingDate for service requirement update',
      )
    }

    if (!update.serviceRequirement) {
      return update
    }

    const currentVerdict = await this.findById(verdictId, transaction)

    // prevent updating service requirement AGAIN after a verdict has been served by police and potentially override the service date
    if (
      currentVerdict.serviceRequirement === ServiceRequirement.REQUIRED &&
      currentVerdict.serviceDate
    ) {
      throw new BadRequestException(
        `Cannot update service requirement to ${update.serviceRequirement} - verdict ${verdictId} has already be served`,
      )
    }
    // in case of repeated update, we ensure that service date is not set for specific service requirements
    return {
      ...update,
      ...(update.serviceRequirement === ServiceRequirement.NOT_APPLICABLE
        ? { serviceDate: rulingDate }
        : { serviceDate: null }),
    }
  }

  private async updateVerdict(
    verdict: Verdict,
    update: UpdateVerdictDto,
    transaction?: Transaction,
  ): Promise<Verdict> {
    const [numberOfAffectedRows, updatedVerdict] =
      await this.verdictModel.update(update, {
        where: { id: verdict.id },
        returning: true,
        transaction,
      })

    if (numberOfAffectedRows > 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows ${numberOfAffectedRows} affected when updating verdict`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(
        `Could not update verdict ${verdict.id}`,
      )
    }

    return updatedVerdict[0]
  }

  async update(
    verdict: Verdict,
    update: UpdateVerdictDto,
    rulingDate?: Date,
  ): Promise<Verdict> {
    return this.sequelize.transaction(async (transaction) => {
      const enhancedUpdate = await this.handleServiceRequirementUpdate(
        verdict.id,
        update,
        transaction,
        rulingDate,
      )

      return this.updateVerdict(verdict, enhancedUpdate, transaction)
    })
  }

  async updateRestricted(
    verdict: Verdict,
    update: InternalUpdateVerdictDto,
  ): Promise<Verdict> {
    const updatedVerdict = await this.updateVerdict(verdict, update)
    return updatedVerdict
  }
}
