import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { isCompany } from 'kennitala'
import { isSameAsApplicant } from '..'

// Should hide responsible person field if transporter is a company nationalId
export const shouldShowResponsiblePerson = (answers: FormValue): boolean => {
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
