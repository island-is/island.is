import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const isContractor = (answers: FormValue) => {
  const isContractor =
    getValueViaPath<string[]>(answers, 'assigneeInformation.isContractor') ?? []
  return isContractor?.includes('yes')
}
