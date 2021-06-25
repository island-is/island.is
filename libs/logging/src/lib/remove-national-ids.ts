import { MESSAGE } from 'triple-beam'
import { format } from 'winston'

const nationalIdRegexp = /\b\d{6}-?\d{4}\b/g
const messageSymbol = (MESSAGE as unknown) as string
const prod = process.env.NODE_ENV === 'production'
const replaceString = prod ? '##MASKED##' : '**REMOVE_PII: $&**'

export const removeNationalIds = format((info) => {
  info[messageSymbol] = info[messageSymbol]?.replace(
    nationalIdRegexp,
    replaceString,
  )
  return info
})
