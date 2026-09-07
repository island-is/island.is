import { TreatmentBaseDto } from '@island.is/clients/health-directorate'

import { HealthDirectorateTreatment } from '../models/treatment.model'

export const mapTreatment = (
  dto: TreatmentBaseDto,
): HealthDirectorateTreatment => ({
  id: dto.id,
  name: dto.name,
  organizationName: dto.organizationName ?? undefined,
  departmentName: dto.departmentName ?? undefined,
})
