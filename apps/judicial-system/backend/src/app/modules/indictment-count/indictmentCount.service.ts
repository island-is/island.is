import { Transaction } from 'sequelize'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  IndictmentCountOffense,
  isTrafficViolationIndictmentCount,
} from '@island.is/judicial-system/types'

import {
  IndictmentCount,
  IndictmentCountRepositoryService,
  Offense,
  OffenseRepositoryService,
} from '../repository'
import { UpdateIndictmentCountDto } from './dto/updateIndictmentCount.dto'
import { UpdateOffenseDto } from './dto/updateOffense.dto'

@Injectable()
export class IndictmentCountService {
  constructor(
    private readonly indictmentCountRepositoryService: IndictmentCountRepositoryService,
    private readonly offenseRepositoryService: OffenseRepositoryService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async findById(indictmentCountId: string): Promise<IndictmentCount> {
    const indictmentCount =
      await this.indictmentCountRepositoryService.findByIdWithOffenses(
        indictmentCountId,
      )

    if (!indictmentCount) {
      throw new NotFoundException(
        `IndictmentCount ${indictmentCountId} not found`,
      )
    }

    return indictmentCount
  }

  private async getMaxDisplayOrder(
    caseId: string,
    transaction: Transaction,
  ): Promise<number> {
    const maxDisplayOrder =
      await this.indictmentCountRepositoryService.getMaxDisplayOrderForCase(
        caseId,
        { transaction },
      )

    return maxDisplayOrder ?? -1
  }

  async reorder(
    caseId: string,
    counts: { id: string; displayOrder: number }[],
    transaction: Transaction,
  ): Promise<IndictmentCount[]> {
    const updates = counts.map(async ({ id, displayOrder }) => {
      const { numberOfAffectedRows, indictmentCounts } =
        await this.indictmentCountRepositoryService.updateByIdAndCase(
          id,
          caseId,
          { displayOrder },
          { transaction },
        )

      if (numberOfAffectedRows !== 1 || !indictmentCounts[0]) {
        throw new NotFoundException(
          `IndictmentCount ${id} not found for case ${caseId}`,
        )
      }

      return indictmentCounts[0]
    })

    return Promise.all(updates)
  }

  async renormalizeDisplayOrder(
    caseId: string,
    transaction: Transaction,
  ): Promise<void> {
    const counts =
      await this.indictmentCountRepositoryService.findAllForCaseOrdered(
        caseId,
        { transaction },
      )

    if (counts.length === 0) {
      return
    }

    await this.reorder(
      caseId,
      counts.map((count, index) => ({ id: count.id, displayOrder: index })),
      transaction,
    )
  }

  async create(
    caseId: string,
    transaction: Transaction,
  ): Promise<IndictmentCount> {
    const displayOrder =
      (await this.getMaxDisplayOrder(caseId, transaction)) + 1

    return this.indictmentCountRepositoryService.create(
      caseId,
      { displayOrder },
      { transaction },
    )
  }

  async createWithPoliceCaseNumber(
    caseId: string,
    policeCaseNumber: string,
    transaction: Transaction,
  ): Promise<IndictmentCount> {
    const displayOrder =
      (await this.getMaxDisplayOrder(caseId, transaction)) + 1

    return this.indictmentCountRepositoryService.create(
      caseId,
      { policeCaseNumber, displayOrder },
      { transaction },
    )
  }

  async update(
    caseId: string,
    indictmentCountId: string,
    update: UpdateIndictmentCountDto,
    transaction: Transaction,
  ): Promise<IndictmentCount> {
    const updateIndictmentCount = async () => {
      const policeCaseNumberSubtypes = update.policeCaseNumberSubtypes
      const updatedSubtypes = update.indictmentCountSubtypes
      if (!policeCaseNumberSubtypes || !updatedSubtypes) {
        return this.indictmentCountRepositoryService.updateByIdAndCase(
          indictmentCountId,
          caseId,
          update,
          { transaction },
        )
      }

      const isTrafficViolation = isTrafficViolationIndictmentCount(
        updatedSubtypes,
        policeCaseNumberSubtypes,
      )

      // if traffic violation subtype is not present we need to handle a cascading update
      // for indictment count and offenses
      const updatedIndictmentCount = !isTrafficViolation
        ? {
            ...update,
            vehicleRegistrationNumber: null,
            recordedSpeed: null,
            speedLimit: null,
            lawsBroken: [], // currently we only support traffic violation laws broken
            legalArguments: '', // currently we set traffic violation legal arguments based on laws broken
          }
        : update

      if (!isTrafficViolation) {
        // currently offenses only exist for traffic violation indictment subtype.
        // if we support other offenses per subtype in the future we have to take the subtype into account
        await this.offenseRepositoryService.deleteAllForIndictmentCount(
          indictmentCountId,
          { transaction },
        )
      }

      return this.indictmentCountRepositoryService.updateByIdAndCase(
        indictmentCountId,
        caseId,
        updatedIndictmentCount,
        { transaction },
      )
    }

    const { numberOfAffectedRows, indictmentCounts } =
      await updateIndictmentCount()

    if (numberOfAffectedRows > 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when updating indictment count ${indictmentCountId} of case ${caseId}`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(
        `Could not update indictment count ${indictmentCountId} of case ${caseId}`,
      )
    }

    return indictmentCounts[0]
  }

  async delete(
    caseId: string,
    indictmentCountId: string,
    transaction: Transaction,
  ): Promise<boolean> {
    await this.offenseRepositoryService.deleteAllForIndictmentCount(
      indictmentCountId,
      { transaction },
    )

    const numberOfAffectedRows =
      await this.indictmentCountRepositoryService.deleteByIdAndCase(
        indictmentCountId,
        caseId,
        { transaction },
      )

    if (numberOfAffectedRows > 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when deleting indictment count ${indictmentCountId} of case ${caseId}`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(
        `Could not delete indictment count ${indictmentCountId} of case ${caseId}`,
      )
    }

    await this.renormalizeDisplayOrder(caseId, transaction)

    return true
  }

  async createOffense(
    indictmentCountId: string,
    offense: IndictmentCountOffense,
  ): Promise<Offense> {
    return this.offenseRepositoryService.create(indictmentCountId, offense)
  }

  async updateOffense(
    indictmentCountId: string,
    offenseId: string,
    update: UpdateOffenseDto,
  ): Promise<Offense> {
    const { numberOfAffectedRows, offenses } =
      await this.offenseRepositoryService.updateByIdAndIndictmentCount(
        offenseId,
        indictmentCountId,
        update,
      )

    if (numberOfAffectedRows > 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when updating offense ${offenseId} for indictment count ${indictmentCountId}`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(
        `Could not update offense ${offenseId} for indictment count ${indictmentCountId}`,
      )
    }

    return offenses[0]
  }

  async deleteOffense(
    indictmentCountId: string,
    offenseId: string,
  ): Promise<boolean> {
    const numberOfAffectedRows =
      await this.offenseRepositoryService.deleteByIdAndIndictmentCount(
        offenseId,
        indictmentCountId,
      )

    if (numberOfAffectedRows > 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when deleting offense ${offenseId} for indictment count ${indictmentCountId}`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(
        `Could not delete offense ${offenseId} for indictment count ${indictmentCountId}`,
      )
    }

    return true
  }
}
