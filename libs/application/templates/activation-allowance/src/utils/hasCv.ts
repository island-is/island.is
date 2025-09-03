import { getValueViaPath, YES } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const hasCv = (answers: FormValue) => {
  const hasCv = getValueViaPath<string>(answers, `cv.haveCV`)

  if (!hasCv || hasCv !== YES) {
    return false
  }
  return true
}
