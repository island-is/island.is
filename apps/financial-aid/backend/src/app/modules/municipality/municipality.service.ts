import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { MunicipalityModel } from './models'
import { AidModel } from '../aid'

@Injectable()
export class MunicipalityService {
  constructor(
    @InjectModel(MunicipalityModel)
    private readonly municipalityModel: typeof MunicipalityModel,
  ) {}

  async findByMunicipalityId(
    municipalityId: string,
  ): Promise<MunicipalityModel> {
    return await this.municipalityModel.findOne({
      where: { municipalityId },
      include: [
        {
          model: AidModel,
          as: 'individualAid',
          separate: true,
          where: {
            municipalityId,
            type: 'individual',
          },
        },
        {
          model: AidModel,
          as: 'cohabitationAid',
          separate: true,
          where: {
            municipalityId,
            type: 'cohabitation',
          },
        },
      ],
    })
  }
}
