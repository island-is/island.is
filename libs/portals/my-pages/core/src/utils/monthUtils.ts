import type { MessageDescriptor } from 'react-intl'
import { m } from '../lib/messages'

const monthKeys: Array<keyof typeof m> = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
]

export const monthNumberToMessage = (n: number): MessageDescriptor | undefined => {
  if (n < 1 || n > 12) return undefined
  return m[monthKeys[n - 1]]
}
