import {
  NationalRegistryIndividual,
  SuccessfulDataProviderResult,
} from '@island.is/application/types'
import { RemoveableCountrySchema, ParentInformationSchema, RemoveableStayAbroadSchema } from '../lib/dataSchema'
import { z } from 'zod'

interface IdentityResult extends SuccessfulDataProviderResult {
  data: NationalRegistryIndividual
}

export type CitizenshipExternalData = {
  nationalRegistry?: IdentityResult
}

export type ParentsToApplicant = z.TypeOf<typeof ParentInformationSchema>

export type CountryOfResidence = z.TypeOf<typeof RemoveableCountrySchema>
export type CountryOfVisit = z.TypeOf<typeof RemoveableStayAbroadSchema>