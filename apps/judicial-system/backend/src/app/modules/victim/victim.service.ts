import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { CreateVictimDto } from './dto/createVictim.dto'
import { UpdateVictimDto } from './dto/updateVictim.dto'
import { Victim } from './models/victim.model'

@Injectable()
export class VictimService {
  constructor(
    @InjectModel(Victim)
    private readonly victimModel: typeof Victim,
  ) {}

  async findById(victimId: string): Promise<Victim> {
    const victim = await this.victimModel.findByPk(victimId)

    if (!victim) {
      throw new NotFoundException(`Victim ${victimId} not found`)
    }

    return victim
  }

  async findByCaseId(caseId: string): Promise<Victim[]> {
    return this.victimModel.findAll({
      where: { caseId },
      order: [['created', 'ASC']],
    })
  }

  async create(caseId: string, dto: CreateVictimDto): Promise<Victim> {
    return this.victimModel.create({
      ...dto,
      caseId,
    })
  }

  async update(victimId: string, update: UpdateVictimDto): Promise<Victim> {
    const victim = await this.victimModel.findByPk(victimId)

    if (!victim) {
      throw new NotFoundException(`Victim ${victimId} not found`)
    }

    return victim.update(update)
  }

  async delete(victimId: string): Promise<void> {
    const count = await this.victimModel.destroy({
      where: { id: victimId },
    })

    if (count === 0) {
      throw new NotFoundException(`Victim ${victimId} not found`)
    }
  }
}
