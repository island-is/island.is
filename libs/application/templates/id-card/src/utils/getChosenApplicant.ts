import { getValueViaPath } from '@island.is/application/core'
import {
  FormValue,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { IdentityDocumentChild } from '../lib/constants'

export interface ChosenApplicant {
  name?: string | null
  isApplicant: boolean
  nationalId?: string | null
}

export const getChosenApplicant = (
  answers: FormValue,
  externalData: any,
  nationalId?: string | null,
): ChosenApplicant => {
  const applicantIdentity = getValueViaPath(
    externalData,
    'nationalRegistry.data',
    {},
  ) as NationalRegistryIndividual

  const applicantChildren = getValueViaPath(
    externalData,
    'identityDocument.data.childPassports',
    [],
  ) as Array<IdentityDocumentChild>

  if (!nationalId || applicantIdentity?.nationalId === nationalId) {
    return {
      name: applicantIdentity?.fullName,
      isApplicant: true,
      nationalId: applicantIdentity.nationalId,
    }
  } else {
    const chosenChild = applicantChildren.filter(
      (x) => x.childNationalId === nationalId,
    )?.[0]
    return {
      name: chosenChild.childName,
      isApplicant: false,
      nationalId: chosenChild.childNationalId,
    }
  }
}
