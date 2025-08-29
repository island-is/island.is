import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { Case } from '../models/case.model'

@Injectable()
export class CaseRepositoryService {
  constructor(@InjectModel(Case) private readonly caseModel: typeof Case) {}

  async findById(id: string): Promise<Case | null> {
    return await this.caseModel.findByPk(id)
  }
}