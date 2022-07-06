import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const getInjuredPersonInformation = (answers: FormValue) => {
  const injuredPersonsEmail = getValueViaPath(
    answers,
    'injuredPersonInformation.email',
  ) as string

  const injuredPersonsName = getValueViaPath(
    answers,
    'injuredPersonInformation.name',
  ) as string
  const injuredPersonsInformation = {
    email: injuredPersonsEmail,
    name: injuredPersonsName,
  }
  return injuredPersonsInformation
}
