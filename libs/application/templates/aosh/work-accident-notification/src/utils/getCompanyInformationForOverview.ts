import { getValueViaPath } from '@island.is/application/core'
import { FormatMessage, FormValue } from '@island.is/application/types'
import { information } from '../lib/messages'
import { format as formatKennitala } from 'kennitala'

export const getCompanyInformationForOverview = (
  person: string,
  answers: FormValue,
  formatMessage: FormatMessage,
) => {
  // TODO
  // const personInformation = getValueViaPath(
  //   answers,
  //   person,
  // ) as PersonInformation

  // return [
  //   personInformation.name,
  //   personInformation.nationalId
  //     ? formatKennitala(personInformation.nationalId)
  //     : '',
  //   `${personInformation.address}, ${personInformation.postCode}`,
  //   personInformation.email,
  // ]
  return null
}
