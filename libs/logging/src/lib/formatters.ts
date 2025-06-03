import { MESSAGE } from 'triple-beam'
import { format } from 'winston'

import { maskNationalId } from '@island.is/shared/pii'

const messageSymbol = (MESSAGE as unknown) as string

export const maskNationalIdFormatter = format((info) => {
  const message = info[messageSymbol]
  if (typeof message !== 'string') {
    throw new Error('Expected string message')
  }
  info[messageSymbol] = maskNationalId(message)
  return info
})
