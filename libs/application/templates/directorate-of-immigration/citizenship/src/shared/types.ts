import {
  NationalRegistryIndividual,
  SuccessfulDataProviderResult,
} from '@island.is/application/types'
import { ParentInformationSchema } from '../lib/dataSchema'
import { z } from 'zod'

interface IdentityResult extends SuccessfulDataProviderResult {
  data: NationalRegistryIndividual
}

export type CitizenshipExternalData = {
  nationalRegistry?: IdentityResult
}

export type ParentsToApplicant = z.TypeOf<typeof ParentInformationSchema>
