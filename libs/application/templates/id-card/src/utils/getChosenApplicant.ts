import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { IdentityDocumentChild } from '../lib/constants'

export interface ChosenApplicant {
  name?: string | null
  isApplicant: boolean
  nationalId: string | null
  secondParentName?: string | null
}

export const getChosenApplicant = (
  externalData: ExternalData,
  nationalId: string | null,
): ChosenApplicant => {
  const applicantIdentity = getValueViaPath<NationalRegistryIndividual>(
    externalData,
    'nationalRegistry.data',
  )

  const applicantChildren = getValueViaPath(
    externalData,
    'identityDocument.data.childPassports',
    [],
  ) as Array<IdentityDocumentChild>

  //this nationalId null check is only because conditions are rendered before applicant has been chosen
  if (!nationalId || applicantIdentity?.nationalId === nationalId) {
    return {
      name: applicantIdentity?.fullName,
      isApplicant: true,
      nationalId: applicantIdentity?.nationalId ?? '',
    }
  } else {
    const chosenChild = applicantChildren.filter(
      (x) => x.childNationalId === nationalId,
    )?.[0]
    return {
      name: chosenChild.childName,
      isApplicant: false,
      nationalId: chosenChild.childNationalId || '',
      secondParentName: chosenChild.secondParentName,
    }
  }
}
