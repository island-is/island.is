import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { MunicipalityModel } from './models'

import { Municipality } from '@island.is/financial-aid/shared'

import { MunicipalityQueryInput } from './dto'

@Injectable()
export class MunicipalityService {
  constructor(
    @InjectModel(MunicipalityModel)
    private readonly municipalityModel: typeof MunicipalityModel,
  ) {}

  findById(id: string): Promise<Municipality> {
    const mockApplication: Municipality = {
      id: id,
      name: 'Hafnarfjörður',
      settings: {
        aid: {
          ownApartmentOrLease: 300000,
          withOthersOrUnknow: 200000,
          withParents: 100000,
        },
      },
    }
    return Promise.resolve(mockApplication)
  }
}
