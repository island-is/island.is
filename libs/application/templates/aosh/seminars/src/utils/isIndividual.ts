import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { IndividualOrCompany } from '../shared/types'

export const isIndividual = (answers: FormValue): boolean => {
  const individualOrCompany = getValueViaPath<IndividualOrCompany>(
    answers,
    'paymentArrangement.individualOrCompany',
  )
  return individualOrCompany === IndividualOrCompany.individual
}
