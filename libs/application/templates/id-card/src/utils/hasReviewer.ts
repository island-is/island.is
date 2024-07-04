import { ExternalData, FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { IdentityDocumentChild, Routes } from '../lib/constants'

export const hasReviewer = (answers: FormValue, externalData: ExternalData) => {
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

  const applicantNationalId = getValueViaPath(
    externalData,
    'nationalRegistry.data.nationalId',
    '',
  ) as string
  if (chosenApplicantNationalId !== applicantNationalId) {
    //logged in user is not the applicant
    const chosenChild = applicantChildren.find(
      (x) => x.childNationalId === chosenApplicantNationalId,
    )
    return !!chosenChild?.secondParent
  }

  return false
}
