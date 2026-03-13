import { Query, Resolver } from '@nestjs/graphql'

import { IcelandicMedicinesAgencyPharmacy } from './models/pharmacy.model'
import { IcelandicMedicinesAgencyPharmaciesCollection } from './models/pharmaciesCollection.model'
import { IcelandicMedicinesAgencyService } from './icelandic-medicines-agency.service'

@Resolver(() => IcelandicMedicinesAgencyPharmacy)
export class IcelandicMedicinesAgencyResolver {
  constructor(
    private readonly icelandicMedicinesAgencyService: IcelandicMedicinesAgencyService,
  ) {}

  @Query(() => IcelandicMedicinesAgencyPharmaciesCollection, {
    name: 'icelandicMedicinesAgencyPharmacies',
    nullable: true,
  })
  async icelandicMedicinesAgencyPharmacies(): Promise<IcelandicMedicinesAgencyPharmaciesCollection> {
    return this.icelandicMedicinesAgencyService.getPharmacies()
  }
}
