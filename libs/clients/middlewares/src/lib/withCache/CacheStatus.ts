// Implements the cache-status standard:
// https://datatracker.ietf.org/doc/draft-ietf-httpbis-cache-header/

type FwdValue =
  | 'bypass'
  | 'method'
  | 'vary-miss'
  | 'miss'
  | 'request'
  | 'stale'
  | 'partial'

export interface CacheStatus {
  cacheName: string
  hit?: boolean
  fwd?: FwdValue
  fwdStatus?: number
  ttl?: number
  stored?: boolean
  rest?: string[]
}

const PART_SEP = /\s*;\s*/g

const parseSfInteger = (value?: string): number | undefined => {
  const parsed = parseInt(value ?? '', 10)
  return isNaN(parsed) ? undefined : parsed
}

const parseCacheStatusLine = (line: string): CacheStatus | undefined => {
  const parts = line.trim().split(PART_SEP)
  const cacheName = parts.shift()
  const rest: string[] = []
  if (!cacheName) {
    return undefined
  }

  const cacheStatus: CacheStatus = {
    cacheName,
  }

  for (const part of parts) {
    const [field, value] = part.trim().split('=')
    switch (field.toLowerCase()) {
      case 'hit':
        cacheStatus.hit = value !== '?0'
        break
      case 'fwd':
        cacheStatus.fwd = value as FwdValue
        break
      case 'fwdStatus':
        cacheStatus.fwdStatus = parseSfInteger(value)
        break
      case 'ttl':
        cacheStatus.ttl = parseSfInteger(value)
        break
      case 'stored':
        cacheStatus.stored = value !== '?0'
        break
      default:
        rest.push(part)
    }
  }
  if (rest.length > 0) {
    cacheStatus.rest = rest
  }
  return cacheStatus
}

export const parseCacheStatusHeader = (
  cacheStatus: string | null,
): CacheStatus[] => {
  if (!cacheStatus) {
    return []
  }
  return cacheStatus
    .split(',')
    .map(parseCacheStatusLine)
    .filter(Boolean) as CacheStatus[]
}

export const serializeCacheStatusHeader = (
  cacheStatus: CacheStatus[],
): string => {
  return cacheStatus
    .map((cacheStatus) => {
      const parts = [cacheStatus.cacheName]
      if (cacheStatus.hit !== undefined) {
        parts.push(`hit${cacheStatus.hit ? '' : '=?0'}`)
      }
      if (cacheStatus.fwd !== undefined) {
        parts.push(`fwd=${cacheStatus.fwd}`)
      }
      if (cacheStatus.fwdStatus !== undefined) {
        parts.push(`fwd-status=${cacheStatus.fwdStatus}`)
      }
      if (cacheStatus.ttl !== undefined) {
        parts.push(`ttl=${Math.round(cacheStatus.ttl)}`)
      }
      if (cacheStatus.stored !== undefined) {
        parts.push(`stored${cacheStatus.stored ? '' : '=?0'}`)
      }
      if (cacheStatus.rest) {
        parts.push(...cacheStatus.rest)
      }
      return parts.join('; ')
    })
    .join(', ')
}
