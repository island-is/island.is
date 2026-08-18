import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { InstitutionType } from '@island.is/judicial-system/types'

import { Institution } from '../models/institution.model'

@Injectable()
export class InstitutionRepositoryService {
  constructor(
    @InjectModel(Institution)
    private readonly institutionModel: typeof Institution,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async findById(institutionId: string): Promise<Institution | null> {
    try {
      this.logger.debug(`Finding institution ${institutionId}`)

      return await this.institutionModel.findByPk(institutionId)
    } catch (error) {
      this.logger.error(`Error finding institution ${institutionId}:`, {
        error,
      })

      throw error
    }
  }

  async findAllActive(types?: InstitutionType[]): Promise<Institution[]> {
    try {
      this.logger.debug('Finding all active institutions')

      return await this.institutionModel.findAll({
        order: ['name'],
        where: { active: true, ...(types ? { type: types } : {}) },
      })
    } catch (error) {
      this.logger.error('Error finding all active institutions:', { error })

      throw error
    }
  }
}
