import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

const maybeAllowedCategories = ['IA', 'IF', 'IM', 'JL', 'IB', 'KG']

export const canMaybeRegisterToTraffic = (answers: FormValue) => {
  const registrationNumberPrefix = getValueViaPath(
    answers,
    'machine.aboutMachine.registrationNumberPrefix',
    '',
  ) as string

  return maybeAllowedCategories.some(
    (category) => category === registrationNumberPrefix,
  )
}
