import { getValueViaPath, YES } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { isCompany } from 'kennitala'

export * from './getOverviewItems'

// Should hide responsible person field if transporter is a company nationalId
export const shouldIncludeResponsiblePerson = (answers: FormValue) => {
  // If transporter is same as applicant, then it is not a company nationalId
  if (isSameAsApplicant(answers, 'transporter')) {
    return false
  }

  const transporterNationalId = getValueViaPath<string>(
    answers,
    'transporter.nationalId',
  )

  if (!transporterNationalId) {
    return false
  }

  return isCompany(transporterNationalId)
}

export const isSameAsApplicant = (
  answers: FormValue,
  fieldKey: string,
): boolean => {
  const isSameAsApplicantArr =
    getValueViaPath<string[]>(answers, `${fieldKey}.isSameAsApplicant`) || []
  return isSameAsApplicantArr?.includes(YES)
}
