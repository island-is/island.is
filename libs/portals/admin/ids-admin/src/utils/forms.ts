import { z } from 'zod'

const pseudolocalizationMap = {
  ð: 'd',
  þ: 'th',
  æ: 'ae',
  ö: 'o',
  á: 'a',
  é: 'e',
  í: 'i',
  ó: 'o',
  ú: 'u',
  ý: 'y',
  Ð: 'd',
  Þ: 'th',
  Æ: 'ae',
  Ö: 'o',
  Á: 'a',
  É: 'e',
  Í: 'i',
  Ó: 'o',
  Ú: 'u',
  Ý: 'y',
}

export const pseudolocalizeString = (str = ''): string => {
  return str.replace(/[ðþæöáéíóúýÐÞÆÖÁÉÍÓÚÝ]/g, (m) => {
    return pseudolocalizationMap[m as keyof typeof pseudolocalizationMap]
  })
}

/**
 * Formats the client id to be lowercase and replace spaces with dashes.
 */
const formatID = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, '-')

/**
 * Parses the client/permission id to be lowercase and replace spaces with dashes
 * Also makes sure that the prefix is always present and cannot be erased
 *
 * @param prefix The prefix to be added to the id
 * @param value The value which will be concatenated with the prefix
 */
export const parseID = ({
  prefix,
  value,
}: {
  prefix: string
  value: string
}) => {
  // If user tries to erase the prefix, we add it back
  if (prefix.startsWith(value) && value.length < prefix.length) {
    return prefix
  }

  if (value.includes(prefix)) {
    value = value.replace(prefix, '')
    return `${prefix}${formatID(value)}`
  }

  const prefixWithoutSlash = prefix.split('/')[0]

  if (value.startsWith(prefixWithoutSlash)) {
    value = value.replace(prefixWithoutSlash, '')
  }

  value = pseudolocalizeString(value)

  // If user tries to erase the prefix, we add it back
  return `${prefix}${formatID(value).split('/').join('/')}`
}

export const booleanCheckbox = z.preprocess(
  (value) => value === 'true',
  z.boolean(),
)
