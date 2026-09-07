import { ObjectType } from '@nestjs/graphql'

import { PaginatedResponse } from '@island.is/nest/pagination'

import { IcelandicMedicinesAgencyMedicalClinic } from './medicalClinic.model'

@ObjectType('IcelandicMedicinesAgencyMedicalClinics')
export class IcelandicMedicinesAgencyMedicalClinicsCollection extends PaginatedResponse(
  IcelandicMedicinesAgencyMedicalClinic,
) {}
