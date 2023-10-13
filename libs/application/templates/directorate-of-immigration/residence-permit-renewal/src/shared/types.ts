import {
  NationalRegistryIndividual,
  SuccessfulDataProviderResult,
} from '@island.is/application/types'
import { z } from 'zod'
import {
  RemoveableCriminalRecordSchema,
  RemoveableEmploymentSchema,
  RemoveableStayAbroadSchema,
  StudySchema,
} from '../lib/dataSchema'

interface IdentityResult extends SuccessfulDataProviderResult {
  data: NationalRegistryIndividual
}

export type ResidencePermitRenewalExternalData = {
  nationalRegistry?: IdentityResult
}

export type CountryOfVisit = z.TypeOf<typeof RemoveableStayAbroadSchema>
export type CriminalRecordItem = z.TypeOf<typeof RemoveableCriminalRecordSchema>
export type EmploymentItem = z.TypeOf<typeof RemoveableEmploymentSchema>
export type ApplicantSchool = z.TypeOf<typeof StudySchema>
