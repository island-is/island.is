import type { MessageDescriptor } from 'react-intl'
import { m } from '../lib/messages'

const monthKeys = [
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
] satisfies Array<keyof typeof m>

export const monthNumberToMessage = (n: number): MessageDescriptor | undefined => {
  if (n < 1 || n > 12) return undefined
  return m[monthKeys[n - 1]]
}
