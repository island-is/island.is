import { getValueViaPath } from '@island.is/application/core'
import { FormatMessage, FormValue } from '@island.is/application/types'
import { PersonInformation } from '../lib/dataSchema'
import { information } from '../lib/messages'

export const getPersonInformationForOverview = (
  person: string,
  answers: FormValue,
  formatMessage: FormatMessage,
) => {
  const personInformation = getValueViaPath(
    answers,
    person,
  ) as PersonInformation

  return [
    personInformation.name,
    personInformation.nationalId,
    `${personInformation.address}, ${personInformation.postCode}`,
    `${formatMessage(information.labels.owner.phone)}: ${
      personInformation.phone
    }`,
    personInformation.email,
  ]
}
