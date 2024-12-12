import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { YES } from './constants'
import { YesOrNo } from '../types'

export const isFatalAccident = (formValue: FormValue) => {
  const wasTheAccidentFatal = getValueViaPath(
    formValue,
    'wasTheAccidentFatal',
  ) as YesOrNo
  return wasTheAccidentFatal === YES
}
