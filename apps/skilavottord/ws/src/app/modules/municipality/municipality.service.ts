import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { MunicipalityModel } from './municipality.model'

@Injectable()
export class MunicipalityService {
  constructor(
    @InjectModel(MunicipalityModel)
    private municipalityModel: typeof MunicipalityModel,
  ) {}

  async findAll(): Promise<MunicipalityModel[]> {
    return await this.municipalityModel.findAll()
  }
}
