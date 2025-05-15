import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const isRejected = (answers: FormValue) => {
  return getValueViaPath<boolean>(answers, 'rejected') ?? false
}
