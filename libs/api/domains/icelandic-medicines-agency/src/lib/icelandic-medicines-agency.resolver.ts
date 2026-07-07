import { Query, Resolver } from '@nestjs/graphql'

import { IcelandicMedicinesAgencyMedicalClinicsCollection } from './models/medicalClinicsCollection.model'
import { IcelandicMedicinesAgencyPharmaciesCollection } from './models/pharmaciesCollection.model'
import { IcelandicMedicinesAgencyWholesalersCollection } from './models/wholesalersCollection.model'
import { IcelandicMedicinesAgencyService } from './icelandic-medicines-agency.service'

@Resolver()
export class IcelandicMedicinesAgencyResolver {
  constructor(
    private readonly icelandicMedicinesAgencyService: IcelandicMedicinesAgencyService,
  ) {}

  @Query(() => IcelandicMedicinesAgencyPharmaciesCollection, {
    name: 'icelandicMedicinesAgencyPharmacies',
  })
  async icelandicMedicinesAgencyPharmacies(): Promise<IcelandicMedicinesAgencyPharmaciesCollection> {
    return this.icelandicMedicinesAgencyService.getPharmacies()
  }

  @Query(() => IcelandicMedicinesAgencyMedicalClinicsCollection, {
    name: 'icelandicMedicinesAgencyMedicalClinics',
  })
  async icelandicMedicinesAgencyMedicalClinics(): Promise<IcelandicMedicinesAgencyMedicalClinicsCollection> {
    return this.icelandicMedicinesAgencyService.getMedicalClinics()
  }

  @Query(() => IcelandicMedicinesAgencyWholesalersCollection, {
    name: 'icelandicMedicinesAgencyWholesalers',
  })
  async icelandicMedicinesAgencyWholesalers(): Promise<IcelandicMedicinesAgencyWholesalersCollection> {
    return this.icelandicMedicinesAgencyService.getWholesalers()
  }
}
