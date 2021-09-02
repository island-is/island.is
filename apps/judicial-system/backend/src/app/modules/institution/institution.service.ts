import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

import { Institution } from './institution.model'

@Injectable()
export class InstitutionService {
  constructor(
    @InjectModel(Institution)
    private readonly institutionModel: typeof Institution,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async getAll(): Promise<Institution[]> {
    this.logger.debug('Getting all institutions')

    return this.institutionModel.findAll({
      order: ['name'],
      where: { active: true },
    })
  }
}
