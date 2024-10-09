import { getValueViaPath } from '@island.is/application/core'
import { FormatMessage, FormValue } from '@island.is/application/types'
import { TechInfo } from '../lib/dataSchema'
import { information } from '../lib/messages'

export const getTechnicalInformation = (
  answers: FormValue,
  formatMessage: FormatMessage,
  lang: 'is' | 'en',
) => {
  const techInfo = getValueViaPath(answers, 'techInfo', []) as TechInfo[]

  return techInfo.map(({ label, labelEn, value }) => {
    return `${lang === 'is' ? label : labelEn}: ${
      value?.nameIs === undefined
        ? ''
        : value.nameIs === 'yes'
        ? formatMessage(information.labels.radioButtons.radioOptionYes)
        : value.nameIs === 'no'
        ? formatMessage(information.labels.radioButtons.radioOptionNo)
        : lang === 'is'
        ? value.nameIs
        : value.nameEn
    }`
  })
}
