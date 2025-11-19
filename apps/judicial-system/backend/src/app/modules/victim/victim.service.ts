import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { Victim } from '../repository'
import { CreateVictimDto } from './dto/createVictim.dto'
import { UpdateVictimDto } from './dto/updateVictim.dto'

@Injectable()
export class VictimService {
  constructor(
    @InjectModel(Victim)
    private readonly victimModel: typeof Victim,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async findById(victimId: string): Promise<Victim> {
    const victim = await this.victimModel.findByPk(victimId)

    if (!victim) {
      throw new NotFoundException(`Victim ${victimId} not found`)
    }

    return victim
  }

  async create(caseId: string, dto: CreateVictimDto): Promise<Victim> {
    return this.victimModel.create({
      ...dto,
      caseId,
    })
  }

  async update(
    caseId: string,
    victimId: string,
    update: UpdateVictimDto,
  ): Promise<Victim> {
    const [numberOfAffectedRows, updatedVictims] =
      await this.victimModel.update(update, {
        where: { id: victimId, caseId },
        returning: true,
      })

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

  async delete(caseId: string, victimId: string): Promise<boolean> {
    const numberOfAffectedRows = await this.victimModel.destroy({
      where: { id: victimId, caseId },
    })

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
