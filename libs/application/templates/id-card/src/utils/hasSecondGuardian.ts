import { ExternalData, FormValue } from '@island.is/application/types'
import { IdentityDocumentData, Routes } from '../lib/constants'
import { getValueViaPath } from '@island.is/application/core'

export const getChildPassport = (
  answers: FormValue,
  externalData: ExternalData,
  nationalId?: string,
) => {
  const chosenApplicantNationalId =
    nationalId ??
    (getValueViaPath(answers, Routes.CHOSENAPPLICANTS, '') as string)
  return (
    externalData.identityDocument?.data as IdentityDocumentData
  )?.childPassports?.find((child) => {
    return child.childNationalId === chosenApplicantNationalId
  })
}

export const hasSecondGuardian = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const child = getChildPassport(answers, externalData)
  return !!child?.secondParent
}
