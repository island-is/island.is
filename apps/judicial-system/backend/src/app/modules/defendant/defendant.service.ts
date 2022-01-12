import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { CreateDefendantDto } from './dto/createDefendant.dto'
import { Defendant } from './models/defendant.model'

@Injectable()
export class DefendantService {
  constructor(
    @InjectModel(Defendant) private readonly defendantModel: typeof Defendant,
  ) {}

  async create(
    caseId: string,
    defendantToCreate: CreateDefendantDto,
  ): Promise<Defendant> {
    return this.defendantModel.create({ ...defendantToCreate, caseId })
  }
}
