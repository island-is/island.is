import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { MunicipalityModel } from './models'
import { AidType } from '@island.is/financial-aid/shared/lib'
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
          where: {
            municipalityId,
            type: AidType.INDIVIDUAL,
          },
        },
        {
          model: AidModel,
          as: 'cohabitationAid',
          where: {
            municipalityId,
            type: AidType.COHABITATION,
          },
        },
      ],
    })
  }
}
