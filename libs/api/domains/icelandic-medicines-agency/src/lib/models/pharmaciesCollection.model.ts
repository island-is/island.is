import { ObjectType } from '@nestjs/graphql'

import { PaginatedResponse } from '@island.is/nest/pagination'

import { IcelandicMedicinesAgencyPharmacy } from './pharmacy.model'

@ObjectType('IcelandicMedicinesAgencyPharmacies')
export class IcelandicMedicinesAgencyPharmaciesCollection extends PaginatedResponse(
  IcelandicMedicinesAgencyPharmacy,
) {}
