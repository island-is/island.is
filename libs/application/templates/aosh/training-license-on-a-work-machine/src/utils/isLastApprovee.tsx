import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const isLastApprovee = (answers: FormValue) => {
  const approved = getValueViaPath<string[]>(answers, 'approved')
  // const
  return true
}
