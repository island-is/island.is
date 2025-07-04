import { Sequelize, Transaction } from 'sequelize'

import { InjectConnection, InjectModel } from '@nestjs/sequelize'

import { Verdict } from './models/verdict.model'

export class VerdictService {
  constructor(
    @InjectConnection() private readonly sequalize: Sequelize,
    @InjectModel(Verdict) private readonly verdictModel: typeof Verdict,
  ) {}

  async createVerdict(
    defendantId: string,
    caseId: string,
    transaction: Transaction,
  ): Promise<Verdict> {
    return this.verdictModel.create({ defendantId, caseId }, { transaction })
  }
}
