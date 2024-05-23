import { getValueViaPath } from '@island.is/application/core'
import {
  Application,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { IdentityDocumentChild, Routes } from '../lib/constants'

export interface ChosenApplicant {
  nationalId: string
  name: string
}

export const getChosenApplicant = (
  application: Application,
  nationalId?: string,
): ChosenApplicant => {
  const applicantIdentity = getValueViaPath(
    application.externalData,
    'nationalRegistry.data',
    undefined,
  ) as NationalRegistryIndividual | undefined

  const applicantChildren = getValueViaPath(
    application.externalData,
    'identityDocument.data.childPassports',
    [],
  ) as Array<IdentityDocumentChild>

  const chosenApplicantNationalId =
    nationalId ??
    (getValueViaPath(
      application.answers,
      Routes.CHOSENAPPLICANTS,
      '',
    ) as string)

  if (applicantIdentity?.nationalId === chosenApplicantNationalId) {
    return {
      nationalId: applicantIdentity?.nationalId,
      name: applicantIdentity?.fullName,
    }
  } else {
    const chosenChild = applicantChildren.filter(
      (x) => x.childNationalId === chosenApplicantNationalId,
    )?.[0]
    return {
      nationalId: chosenChild.childNationalId,
      name: chosenChild.childName,
    }
  }
}
