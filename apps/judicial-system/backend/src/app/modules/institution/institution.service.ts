import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { Institution } from './institution.model'

@Injectable()
export class InstitutionService {
  constructor(
    @InjectModel(Institution)
    private readonly institutionModel: typeof Institution,
  ) {}

  async getAll(): Promise<Institution[]> {
    return this.institutionModel.findAll({
      order: ['name'],
      where: { active: true },
    })
  }
}
