import type { ParsedUrlQuery } from 'querystring'

/** Case-insensitive first value of a query param, trimmed and lowercased */
export const getQueryValue = (query: ParsedUrlQuery, key: string) => {
  const matchingKey = Object.keys(query).find(
    (k) => k.toLowerCase() === key.toLowerCase(),
  )
  const value = matchingKey ? query[matchingKey] : undefined
  return (Array.isArray(value) ? value[0] : value)?.trim().toLowerCase()
}

const GUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

export const isGuid = (value: string) => GUID_REGEX.test(value)
