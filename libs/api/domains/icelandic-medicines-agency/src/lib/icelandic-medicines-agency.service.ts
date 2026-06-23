import { Injectable } from '@nestjs/common'

import { LyfjastofnunPharmaciesClientService } from '@island.is/clients/lyfjastofnun-pharmacies'

import { IcelandicMedicinesAgencyMedicalClinicsCollection } from './models/medicalClinicsCollection.model'
import { IcelandicMedicinesAgencyPharmaciesCollection } from './models/pharmaciesCollection.model'
import { IcelandicMedicinesAgencyWholesalersCollection } from './models/wholesalersCollection.model'
import { mapToMedicalClinic, mapToPharmacy, mapToWholesaler } from './mapper'

@Injectable()
export class IcelandicMedicinesAgencyService {
  constructor(
    private readonly lyfjastofnunPharmaciesClientService: LyfjastofnunPharmaciesClientService,
  ) {}

  async getPharmacies(): Promise<IcelandicMedicinesAgencyPharmaciesCollection> {
    const data = await this.lyfjastofnunPharmaciesClientService.getPharmacies()
    const pharmacies = data
      .map(mapToPharmacy)
      .sort((a, b) => a.name.localeCompare(b.name))

    return {
      data: pharmacies,
      totalCount: pharmacies.length,
      pageInfo: { hasNextPage: false },
    }
  }

  async getMedicalClinics(): Promise<IcelandicMedicinesAgencyMedicalClinicsCollection> {
    const data =
      await this.lyfjastofnunPharmaciesClientService.getMedicalClinics()
    const clinics = data
      .map(mapToMedicalClinic)
      .sort((a, b) => a.name.localeCompare(b.name))

    return {
      data: clinics,
      totalCount: clinics.length,
      pageInfo: { hasNextPage: false },
    }
  }

  async getWholesalers(): Promise<IcelandicMedicinesAgencyWholesalersCollection> {
    const data =
      await this.lyfjastofnunPharmaciesClientService.getWholesalers()
    const wholesalers = data
      .map(mapToWholesaler)
      .sort((a, b) => a.name.localeCompare(b.name))

    return {
      data: wholesalers,
      totalCount: wholesalers.length,
      pageInfo: { hasNextPage: false },
    }
  }
}
