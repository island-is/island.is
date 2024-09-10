import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { TechInfo } from '../lib/dataSchema'

export const getTechnicalInformation = (answers: FormValue) => {
  const techInfo = getValueViaPath(answers, 'techInfo', []) as TechInfo[]

  return techInfo.map(({ label, value }) => {
    return `${label}: ${value}`
  })
}
