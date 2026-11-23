import { getValueViaPath, YES } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const isSendToOtherAddress = (answers: FormValue): boolean =>
  (
    getValueViaPath(answers, 'sendToAddress.useOtherAddress') as
      | string[]
      | undefined
  )?.includes(YES) ?? false
