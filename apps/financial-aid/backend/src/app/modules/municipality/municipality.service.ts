import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { MunicipalityModel } from './models'

import { Municipality } from '@island.is/financial-aid/shared/lib'

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
          ownApartmentOrLease: 197200,
          withOthersOrUnknow: 157760,
          withParents: 98600,
        },
      },
    }
    return Promise.resolve(mockApplication)
  }
}
