import { FormValue, getValueViaPath } from '@island.is/application/core'
import { YES } from '../constants'
import { YesOrNo } from '../types'

export const isFatalAccident = (formValue: FormValue) => {
  const wasTheAccidentFatal = getValueViaPath(
    formValue,
    'wasTheAccidentFata',
  ) as YesOrNo
  return wasTheAccidentFatal === YES
}
