import { isPerson } from 'kennitala'

const nationalIdRegexp = /\b\d{6}-?\d{4}\b/g
const isProd = process.env.NODE_ENV === 'production'
const replaceString = isProd ? '--MASKED--' : '**REMOVE_PII: $&**'

export const maskNationalId = (text: string) => {
  const matches = text.match(nationalIdRegexp) || []
  matches.forEach((match) => {
    if (isPerson(match)) {
      text = text.replace(match, replaceString)
    }
  })
  return text
}
