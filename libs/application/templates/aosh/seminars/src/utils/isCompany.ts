import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import { isCompanyType } from './isCompanyType'
import { IndividualOrCompany } from '../shared/types'

export const isCompany = (answers: FormValue): boolean => {
  const individualOrCompany = getValueViaPath<IndividualOrCompany>(
    answers,
    'paymentArrangement.individualOrCompany',
  )
  return individualOrCompany === IndividualOrCompany.company
}

export const companyCondition = (
  answers: FormValue,
  externalData: ExternalData,
) => isCompanyType(externalData) || isCompany(answers)
