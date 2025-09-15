import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { InstitutionType } from '@island.is/judicial-system/types'

import { Institution } from '../repository'

@Injectable()
export class InstitutionService {
  constructor(
    @InjectModel(Institution)
    private readonly institutionModel: typeof Institution,
  ) {}

  async getById(id: string): Promise<Institution> {
    return this.institutionModel.findByPk(id).then((institution) => {
      if (!institution) {
        throw new NotFoundException(`Institution ${id} not found`)
      }

      return institution
    })
  }

  async getAll(types?: InstitutionType[]): Promise<Institution[]> {
    return this.institutionModel.findAll({
      order: ['name'],
      where: { active: true, ...(types ? { type: types } : {}) },
    })
  }
}
