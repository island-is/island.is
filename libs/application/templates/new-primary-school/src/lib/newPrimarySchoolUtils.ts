import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { Children } from './constants'

export const getApplicationAnswers = (answers: Application['answers']) => {
  const childsNationalId = getValueViaPath(
    answers,
    'childsNationalId',
  ) as string

  return { childsNationalId }
}

export const getApplicationExternalData = (
  externalData: Application['externalData'],
) => {
  const children = getValueViaPath(
    externalData,
    'childrenCustodyInformation.data',
    [],
  ) as Children[]

  const applicantName = getValueViaPath(
    externalData,
    'identity.data.name',
  ) as string

  const applicantNationalId = getValueViaPath(
    externalData,
    'identity.data.nationalId',
  ) as string

  const applicantAddress = getValueViaPath(
    externalData,
    'identity.data.address.streetAddress',
  ) as string

  const applicantPostalCode = getValueViaPath(
    externalData,
    'identity.data.address.postalCode',
  ) as string

  const city = getValueViaPath(
    externalData,
    'identity.data.address.city',
  ) as string

  const applicantMunicipality = applicantPostalCode + ' ' + city

  return {
    children,
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantMunicipality,
  }
}

export const isChildAtPrimarySchoolAge = (nationalId: string) => {
  const century = nationalId.slice(9, 10)

  // Check if child is born in 2xxx
  if (+century < 9) {
    const birthYear = '2' + century + nationalId.slice(4, 6)
    const currentYear = new Date().getFullYear()
    const age = currentYear - +birthYear

    // Check if the child is at primary school age
    if (age >= 5 && age <= 15) {
      return true
    }

    return false
  }
  return false
}
