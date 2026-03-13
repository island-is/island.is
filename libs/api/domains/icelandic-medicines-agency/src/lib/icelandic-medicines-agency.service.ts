import { Injectable } from '@nestjs/common'

import { LyfjastofnunPharmaciesClientService } from '@island.is/clients/lyfjastofnun-pharmacies'
import { isDefined } from '@island.is/shared/utils'

import { IcelandicMedicinesAgencyPharmaciesCollection } from './models/pharmaciesCollection.model'
import { mapToPharmacy } from './mapper'

@Injectable()
export class IcelandicMedicinesAgencyService {
  constructor(
    private readonly lyfjastofnunPharmaciesClientService: LyfjastofnunPharmaciesClientService,
  ) {}

  async getPharmacies(): Promise<IcelandicMedicinesAgencyPharmaciesCollection> {
    const data =
      await this.lyfjastofnunPharmaciesClientService.getPharmacies()
    const pharmacies = data.map(mapToPharmacy).filter(isDefined)

    return {
      data: pharmacies,
      totalCount: pharmacies.length,
      pageInfo: { hasNextPage: false },
    }
  }
}
