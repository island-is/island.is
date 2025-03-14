import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { IndividualOrCompany } from '../shared/constants'

export const isCompany = (answers: FormValue): boolean => {
  const individualOrCompany = getValueViaPath<IndividualOrCompany>(
    answers,
    'paymentArrangement.individualOrCompany',
  )
  return individualOrCompany === IndividualOrCompany.company
}
