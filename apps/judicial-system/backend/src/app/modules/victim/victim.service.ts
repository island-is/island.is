import { Transaction } from 'sequelize'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { Victim, VictimRepositoryService } from '../repository'
import { CreateVictimDto } from './dto/createVictim.dto'
import { UpdateVictimDto } from './dto/updateVictim.dto'

@Injectable()
export class VictimService {
  constructor(
    private readonly victimRepositoryService: VictimRepositoryService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async findById(
    victimId: string,
    options: { transaction: Transaction },
  ): Promise<Victim> {
    const victim = await this.victimRepositoryService.findById(
      victimId,
      options,
    )

    if (!victim) {
      throw new NotFoundException(`Victim ${victimId} not found`)
    }

    return victim
  }

  async create(
    caseId: string,
    dto: CreateVictimDto,
    options: { transaction: Transaction },
  ): Promise<Victim> {
    return this.victimRepositoryService.create(caseId, dto, options)
  }

  async update(
    caseId: string,
    victimId: string,
    update: UpdateVictimDto,
    options: { transaction: Transaction },
  ): Promise<Victim> {
    const { numberOfAffectedRows, victims: updatedVictims } =
      await this.victimRepositoryService.updateByIdAndCase(
        victimId,
        caseId,
        update,
        options,
      )

    if (numberOfAffectedRows > 1) {
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when updating victim ${victimId}`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(
        `Could not update victim ${victimId}`,
      )
    }

    return updatedVictims[0]
  }

  async delete(
    caseId: string,
    victimId: string,
    options: { transaction: Transaction },
  ): Promise<boolean> {
    const numberOfAffectedRows =
      await this.victimRepositoryService.deleteByIdAndCase(
        victimId,
        caseId,
        options,
      )

    if (numberOfAffectedRows > 1) {
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when deleting victim ${victimId}`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(
        `Could not delete victim ${victimId}`,
      )
    }

    return true
  }
}
