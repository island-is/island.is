import {
  NationalRegistryBirthplace,
  NationalRegistryIndividual,
  NationalRegistrySpouse,
} from '@island.is/application/types'
import {
  RemoveableCountrySchema,
  ParentInformationSchema,
  RemoveableStayAbroadSchema,
} from '../lib/dataSchema'
import { z } from 'zod'

export type ParentsToApplicant = z.TypeOf<typeof ParentInformationSchema>
export type CountryOfResidence = z.TypeOf<typeof RemoveableCountrySchema>
export type CountryOfVisit = z.TypeOf<typeof RemoveableStayAbroadSchema>

export interface CitizenIndividual extends NationalRegistryIndividual {
  residenceInIcelandLastChangeDate?: Date | null
  maritalTitle?: {
    code?: string | null
    description?: string | null
  } | null
}

export interface SpouseIndividual extends NationalRegistrySpouse {
  spouse?: CitizenIndividual | null
  spouseBirthplace?: NationalRegistryBirthplace | null
  lastModified?: Date | null
}
