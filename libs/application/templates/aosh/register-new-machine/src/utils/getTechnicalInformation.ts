import { getValueViaPath } from '@island.is/application/core'
import { FormatMessage, FormValue } from '@island.is/application/types'
import { TechInfo } from '../lib/dataSchema'
import { information } from '../lib/messages'

export const getTechnicalInformation = (
  answers: FormValue,
  formatMessage: FormatMessage,
) => {
  const techInfo = getValueViaPath(answers, 'techInfo', []) as TechInfo[]

  return techInfo.map(({ label, value }) => {
    return `${label}: ${
      value === undefined
        ? ''
        : value === 'yes'
        ? formatMessage(information.labels.radioButtons.radioOptionYes)
        : value === 'no'
        ? formatMessage(information.labels.radioButtons.radioOptionNo)
        : value
    }`
  })
}
