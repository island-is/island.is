import {
  ExternalData,
  FormValue,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { Routes } from '../lib/constants'
import { getValueViaPath } from '@island.is/application/core'

export const isChild = (answers: FormValue, externalData: ExternalData) => {
  const applicantIdentity = getValueViaPath(
    externalData,
    'nationalRegistry.data',
    undefined,
  ) as NationalRegistryIndividual | undefined

  const chosenApplicantNationalId = getValueViaPath(
    answers,
    Routes.CHOSENAPPLICANTS,
    '',
  ) as string

  return applicantIdentity?.nationalId !== chosenApplicantNationalId
}
