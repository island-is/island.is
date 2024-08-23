import { getValueViaPath } from '@island.is/application/core'
import {
  Application,
  FormValue,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { IdentityDocumentChild, Routes } from '../lib/constants'
import { IdCardAnswers } from '..'

export interface ChosenApplicant {
  name: string
  isApplicant: boolean
  nationalId?: string
}

export const getChosenApplicant = (
  answers: FormValue,
  externalData: any,
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

  const chosenApplicantNationalId = getValueViaPath(
    answers,
    Routes.CHOSENAPPLICANTS,
    '',
  ) as string

  if (
    chosenApplicantNationalId === '' ||
    applicantIdentity?.nationalId === chosenApplicantNationalId
  ) {
    return {
      name: applicantIdentity?.fullName,
      isApplicant: true,
      nationalId: applicantIdentity.nationalId,
    }
  } else {
    const chosenChild = applicantChildren.filter(
      (x) => x.childNationalId === chosenApplicantNationalId,
    )?.[0]
    return {
      name: chosenChild.childName,
      isApplicant: false,
      nationalId: chosenChild.childNationalId,
    }
  }
}
