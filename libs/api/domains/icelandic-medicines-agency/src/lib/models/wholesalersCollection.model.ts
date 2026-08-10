import { ObjectType } from '@nestjs/graphql'

import { PaginatedResponse } from '@island.is/nest/pagination'

import { IcelandicMedicinesAgencyWholesaler } from './wholesaler.model'

@ObjectType('IcelandicMedicinesAgencyWholesalers')
export class IcelandicMedicinesAgencyWholesalersCollection extends PaginatedResponse(
  IcelandicMedicinesAgencyWholesaler,
) {}
