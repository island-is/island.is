import { MESSAGE } from 'triple-beam'
import { format } from 'winston'

import { maskNationalId } from '@island.is/shared/pii'

const messageSymbol = MESSAGE as unknown as string

export const maskNationalIdFormatter = format((info) => {
  info[messageSymbol] = maskNationalId(info[messageSymbol] as string)
  return info
})
