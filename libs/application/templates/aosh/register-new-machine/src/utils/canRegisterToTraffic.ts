import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

const allowedCategories = [
  'EA',
  'EH',
  'FH',
  'HV',
  'IB',
  'JF',
  'KL',
  'IA',
  'IF',
  'IM',
  'JL',
  'KG',
]

export const canRegisterToTraffic = (answers: FormValue) => {
  const registrationNumberPrefix = getValueViaPath(
    answers,
    'machine.aboutMachine.registrationNumberPrefix',
    '',
  ) as string

  return allowedCategories.some(
    (category) => category === registrationNumberPrefix,
  )
}
