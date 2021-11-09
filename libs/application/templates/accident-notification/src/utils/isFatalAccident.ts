import { FormValue } from '@island.is/application/core'
import { YES } from '../constants'
import { AccidentNotification } from '../lib/dataSchema'

export const isFatalAccident = (formValue: FormValue) => {
  const wasTheAccidentFatal = (formValue as AccidentNotification)
    .wasTheAccidentFatal
  return wasTheAccidentFatal === YES
}
