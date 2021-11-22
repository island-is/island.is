import { FormValue } from '@island.is/application/core'

export const getInjuredPersonInformation = (answers: FormValue) => {
  const injuredPersonsEmail = (answers as {
    injuredPersonInformation: { email: string }
  })?.injuredPersonInformation?.email
  const injuredPersonsName = (answers as {
    injuredPersonInformation: { name: string }
  })?.injuredPersonInformation?.name
  const injuredPersonsInformation = {
    email: injuredPersonsEmail,
    name: injuredPersonsName,
  }
  return injuredPersonsInformation
}
