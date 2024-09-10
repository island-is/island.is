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

  const chosenTypeOfId = getValueViaPath(answers, Routes.TYPEOFID, '') as string

  const applicantNationalId = getValueViaPath(
    externalData,
    'nationalRegistry.data.nationalId',
    '',
  ) as string

  //logged in user is not the applicant
  if (chosenApplicantNationalId !== applicantNationalId) {
    //if a parent is applying for nafnskírteini án ferðaskilríkja for a child, then there is no other reviewer needed
    if (chosenTypeOfId === 'II') {
      return false
    }

    //if a parent is applying for nafnskíteini með ferðaskilríkjum for a child
    //then check if there is another parent registered that needs to approve
    const chosenChild = applicantChildren.find(
      (x) => x.childNationalId === chosenApplicantNationalId,
    )
    return !!chosenChild?.secondParent
  }

  return false
}
